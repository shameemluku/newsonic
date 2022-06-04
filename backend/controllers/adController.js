const { uploadBaseFile } = require("../config/s3");
const ActiveAds = require("../models/activeAds");
const Ads = require("../models/ad");
const Posts = require("../models/posts");
const Revenues = require("../models/revenues");
const ObjectId = require("mongodb").ObjectID;

const createAd = async (req, res) => {
  console.log(req.body);
  const {
    format,
    title,
    url,
    startDate,
    endDate,
    estView,
    imageFrm,
    imageSqr,
    estAmount,
    decodeId: sponsorId,
  } = req.body;

  let ad_response = await Ads.create({
    title,
    url,
    format,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    estView,
    estAmount,
    sponsorId: ObjectId(sponsorId),
  });

  let promises = [];

  promises.push(uploadBaseFile(getBuffer(ad_response._id, imageFrm, "FRM")));
  promises.push(uploadBaseFile(getBuffer(ad_response._id, imageSqr, "SQR")));

  Promise.all(promises)
    .then(async function (imagesArray) {
      ad_response.imageFrm = `ad-${ad_response._id}-FRM`;
      ad_response.imageSqr = `ad-${ad_response._id}-SQR`;
      await ad_response.save();

      res.status(200).json({ status: true, details: ad_response });
    })
    .catch(function (err) {
      res.send(err.stack);
    });
};

const approveAd = async (req, res) => {
  const { adId } = req.body;

  let ad_details = await Ads.findOne({ _id: ObjectId(adId) });

  if (
    ad_details &&
    (await ActiveAds.create({
      adId: ad_details._id,
      startDate: ad_details.startDate,
      format: ad_details.format,
      endTime: ad_details.endDate,
    }))
  ) {
    ad_details.isApproved = true;
    await ad_details.save();

    res.status(200).json({ status: true, details: "Approved" });
  } else {
    res.status(404).json({ status: false, details: "Error approving" });
  }
};

const adClicked = async (req, res) => {
  console.log(req.identity);
  console.log(req.body);

  const { userId, type } = req.identity;
  const { format, postId, adId, channelId, sponsorId } = req.body;

  let holder = postId ? `POST-${postId}` : "ADMIN";

  let match =
    type === "SIGN_USER" ? {} : { sponsorId: { $ne: ObjectId(userId) } };

  let response = await Ads.updateOne(
    {
      _id: ObjectId(adId),
      ...match,
      clicks: {
        $not: {
          $elemMatch: {
            userId: userId,
          },
        },
      },
    },
    {
      $addToSet: {
        clicks: {
          userId: userId,
          idType: type,
          holder: holder,
        },
      },
    },
    {
      multi: true,
    }
  );

  console.log(response);

  const { acknowledged, modifiedCount } = response;

  if (acknowledged && modifiedCount > 0) {
    let insert_data =
      holder === "ADMIN"
        ? {
            holder,
          }
        : {
            holder: "POST",
            postId,
            channelId,
          };
    await Revenues.create({
      ...insert_data,
      revType: "CPC",
      adId: ObjectId(adId),
      sponsorId:sponsorId,
      amount: calulateRevenue(format).CPC,
    });
  }

  res.status(200).json({ status: true });
};

const loadDisplayAd = async (req, res) => {
  const { userId, type } = req.identity;
  const { format, postId, channelId } = req.body;

  let holder = postId ? `POST-${postId}` : "ADMIN";

  let active_ads = await ActiveAds.find({
    format: format,
    startDate: { $lt: today() },
  }).populate("adId");

  let selected_ad = active_ads[Math.floor(Math.random() * active_ads.length)];

  if (!selected_ad) {
    res.status(404).json({ status: false });
    return;
  }

  let match =
    type === "SIGN_USER" ? {} : { sponsorId: { $ne: ObjectId(userId) } };

  let response = await Ads.updateOne(
    {
      _id: selected_ad.adId._id,
      ...match,
      views: {
        $not: {
          $elemMatch: {
            userId: userId,
          },
        },
      },
    },
    {
      $addToSet: {
        views: {
          userId: userId,
          idType: type,
          holder: holder,
        },
      },
    },
    {
      multi: true,
    }
  );

  const { acknowledged, modifiedCount } = response;

  if (acknowledged && modifiedCount > 0) {
    let insert_data =
      holder === "ADMIN"
        ? {
            holder,
          }
        : {
            holder: "POST",
            postId,
            channelId,
          };
    await Revenues.create({
      ...insert_data,
      revType: "CPI",
      adId: selected_ad.adId._id,
      sponsorId:selected_ad.adId.sponsorId,
      amount: calulateRevenue(format).CPI,
    });
  }

  res.status(200).json({ status: true, ad: selected_ad.adId });
};

const sponsorDetails = async (req, res) => {
  console.log(req.query);
  const { decodeId: userId } = req.body;

  let ads = await Ads.aggregate([
    { $match: { sponsorId: ObjectId(userId) } },
    { $addFields: { viewsCount: { $size: { $ifNull: ["$views", []] } } } },
    { $addFields: { clickCount: { $size: { $ifNull: ["$clicks", []] } } } },
    { $sort : {_id:-1}}
  ]);


  ads.forEach((val) => {
    if (val.isApproved) {
      if (val.endDate > new Date(today())) {
        if (val.startDate < new Date(today())) val.status = "Active";
        else val.status = "Not Started";
      } else {  val.status = "Ended"  }
    }else{ val.status = "Pending Approval" }

    if(val.isCancelled) val.status = "Cancelled" 

  });

  let total_amount = await Revenues.aggregate([
    {
      $match : { 
        sponsorId : ObjectId(userId),
        isPaid:false
       }
    },
    {
      $group: {_id:null,total:{ $sum: "$amount" }}
    }
  ])


  total_amount = (total_amount.length>0) ? total_amount[0].total : 0.00

  res.status(200).json({ status: true, ads, total_amount });

};

const getRevenueDetails = async (req, res) => {
  try {
    const { adId } = req.params;
    const revenue_details = await Revenues.aggregate([
      { $match: { adId: ObjectId(adId) } },
      {
        $group: { _id: "$revType", sum: { $sum: "$amount" } },
      },
    ]);

    let combined = {};
    revenue_details.map((val) => {
      combined[val._id] = val.sum.toFixed(3);
    });

    if (combined?.CPI) {
      combined.total = combined?.CPC
        ? parseFloat(combined?.CPC) + parseFloat(combined?.CPI)
        : parseFloat(combined?.CPI);
    }


    const paid_data = await Revenues.aggregate([
      { $match: { adId: ObjectId(adId) , isPaid:true }},
      {
        $group: { _id: "", paidSum: { $sum: "$amount" } },
      },
    ]);

    combined.paid_amount = paid_data[0]?.paidSum ?  paid_data[0]?.paidSum.toFixed(2) : '0.00';
    res.status(200).json({ status: true, details: combined });

  } catch (err) {
    console.log(err);
  }
}


const endCampaign = async (req,res) => {
  
  const { adId } = req.params;
  console.log(adId);
  let ad = await Ads.findById(ObjectId(adId))
  ad.isCancelled = true
  ad.save()

}

const getBillingData = async (req,res) => {

  const {decodeId: sponsorId } = req.body;

  const payable_ads = await Revenues.aggregate([
    { $match: { sponsorId: ObjectId(sponsorId) , isPaid:false }},
    {
      $group: { _id: "$adId", amount: { $sum: "$amount" } },
    },
    {
      $lookup:{
        from:"ads",
        foreignField:"_id",
        localField:"_id",
        as:"ad_details"
      }
    },
    {
      $addFields: {
        "ad_data": {$arrayElemAt: ["$ad_details", 0]} ,
      }
    },
    {
      $addFields: {
        "title": "$ad_data.title" ,
        "image": "$ad_data.imageSqr" ,
      }
    },
    { $project:{ _id:1, amount:1,title:1, image:1} }
  ]);
  
  console.log(payable_ads);

  res.status(200).json({ status:true , payable_ads })
  
}


/////////////////////////////////

const getBuffer = (id, image, format) => {
  let buffer = Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  var data = {
    Key: `ad-${id}-${format}`,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };

  return data;
};

const calulateRevenue = (format) => {
  switch (format) {
    case "FRM1":
      return {
        CPI: 0.05,
        CPC: 1.5,
      };
      break;

    case "FRM2":
      return {
        CPI: 0.04,
        CPC: 2,
      };
      break;

    case "FRM3":
      return {
        CPI: 0.04,
        CPC: 1.5,
      };
      break;

    default:
      break;
  }
};

const formatDate = (date) => {
  const newDate = new Date(date);
  newDate.setUTCHours(23);
  newDate.setUTCMinutes(59);
  newDate.setUTCSeconds(59);
  newDate.setUTCMilliseconds(999);
  return newDate;
};

const today = () => {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const dd = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const newDate = `${yy}-${mm}-${dd}`;
  return newDate;
};

module.exports = {
  createAd,
  loadDisplayAd,
  approveAd,
  adClicked,
  sponsorDetails,
  getRevenueDetails,
  endCampaign,
  getBillingData
};
