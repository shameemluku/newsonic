import FingerprintJS from "@fingerprintjs/fingerprintjs";


export const generateSignature =async () => {

    let fp = await FingerprintJS.load()
    let {visitorId} =await fp.get()

    return new Promise ((res,rej)=>{
        res(visitorId)
    })

}