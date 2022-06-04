import FingerprintJS from "@fingerprintjs/fingerprintjs";


export const generateSignature = () => {

    return new Promise (async(res,rej)=>{
        let fp = await FingerprintJS.load()
        let {visitorId} =await fp.get()
        res(visitorId)
    })

}