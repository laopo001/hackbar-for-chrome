
var request = require('request');

request({
    url: "http://x6m5.ams.game.qq.com/ams/ame/ame.php?ameVersion=0.3&sServiceType=bsm&iActivityId=48376&sServiceDepartment=group_5&_=1478587370510",
    method: 'POST',
    form: {
        appid: 1000002110,
        state: "bsm % 2Cokydat4AGxRSAO6V2R16FHWuQWcE%2Ca1c84c1750b44aaea1a29cfa1435972e%2C1478586049",
        sArea: 2,
        sPlatId: 1,
        sPartition: 1011,
        sServiceType: "bsm",
        gameId: "bsm",
        iActivityId: 48376,
        iFlowId: 252154,
        g_tk: 1139994783,
        e_code: 0,
        g_code: 0,
        eas_url: "http % 3A%2F%2Fbsm.qq.com % 2Fact%2Fa20160323qd%2Fqq.htm",
        eas_refer: "http % 3A%2F%2Fbsm.qq.com % 2Fcomm-htdocs % 2Fmilo_mobile%2Flogin.html",
        sServiceDepartment: "group_5"
    },
    headers: {
        "Accept": "*/*",
        "Accept-Encoding":"gzip, deflate",
        "Accept-Language":"zh-CN,zh;q=0.8",
        "Connection": "keep-alive",
        "Content-Length":427,
        "Content-Type":"application/x-www-form-urlencoded",
        "Cookie": "eas_sid=91y407t4c1Z623P0d0R3j1a0C0; ptui_loginuin=3436005460; pac_uid=1_353272497; p_o2_uin=353272497; o_cookie=353272497; ptcz=0543f732d86ba2554ac51bab67cc5a25909cd444cc86c1fcd9d82c6ef3eaab6c; ptisp=ctc; RK=8HNzmtbyMG; luin=o0353272497;lskey=00010000ad046c262635ec495239f304498e0ce2ff9f40ed9b8deeb52a30c468afa2c8e1bd65ec0410bac9c8; pt2gguin=o0353272497; uin=o0353272497; skey=@II8AaDcBE; p_uin=o0353272497; p_skey=VvExQ6qvtgU44ehX81EzJTsVtVByj2reJtPav3Tk-Ao_; pt4_token=2yl1KqcckTCFqx5eVk06hM2UA3-skpzhYakuSxUkUqE_; p_luin=o0353272497; p_lskey=00040000b3e000d3f4b5e8432dbf408981d0baccb2eaed966b29ed80ce6d6c4044c6fc4947cef33e06f43ed3; sid=nPojNkbwh4EMMAp5bLJULlYD6qyca+YP150e82b10201%3D%3D; pgv_pvid=3705842276; pgv_info=pgvReferrer=&ssid=s7197501501; IED_LOG_INFO2=userUin%3D353272497%26nickName%3DNULL%26userLoginTime%3D1478586649",
        "Host": "x6m5.ams.game.qq.com",
        "Origin": "http://bsm.qq.com",
        "Referer": "http://bsm.qq.com/act/a20160323qd/qq.htm?state=bsm,okydat4AGxRSAO6V2R16FHWuQWcE,a1c84c1750b44aaea1a29cfa1435972e,1478586049&sArea=2&sPlatId=1&sPartition=1011&appid=wx26a1ecc603120d4b",
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
    }
}, function (error, response, body) {
   console.log(JSON.stringify(response))
    if (!error && response.statusCode == 200) {
        console.log(JSON.stringify(response.body))
       // log.info('cg');
    } else {
      	console.log("error:" + JSON.stringify(error));
     //   log.error("error:" + JSON.stringify(error));
    }
})