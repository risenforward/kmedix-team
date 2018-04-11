
export var servers:{name, eg, kw}[]=[
{ name:"soa1",  eg: "192.168.0.233:8001"                 ,kw:"172.30.175.203:8001"},
{ name:"soa2",  eg: "cscsoa05-tst-srv.beshara.com:8001"  ,kw:"172.30.175.203:8001"},
{ name:"soa3",  eg: "cscsoa03-tst-srv.beshara.com:8001"  ,kw:"172.30.175.203:8001"},
{ name:"soa4",  eg: "192.168.0.233:7001"                 ,kw:"172.30.175.203:8001"},
{ name:"soa5",  eg: "cscsoa05-tst-srv.beshara.com:7001"  ,kw:"172.30.175.203:8001"},
{ name:"soa6",  eg: "cscsoa03-tst-srv.beshara.com:7001"  ,kw:"172.30.175.203:8001"},
{ name:"soa7",  eg: "CSCSOA05-tst-SRV.beshara.com:7001"  ,kw:"172.30.175.203:8001"},
{ name:"soa8",  eg: "192.168.0.233:8001"  			     ,kw:"172.30.175.203:8001"},
{ name:"soa9",  eg: "192.168.0.123:7001"                 ,kw:"172.30.175.203:8001"},
{ name:"soaA",  eg: "192.168.0.123:8001"                 ,kw:"172.30.175.203:8001"},
{ name:"csc1",  eg: "192.168.0.120"                      ,kw:"172.30.175.111"},
{ name:"csc2",  eg: "csc-app4-srv"                       ,kw:"172.30.175.111"},
{ name:"csc3",  eg: "csc-app1-srv"                       ,kw:"172.30.175.111"},
{ name:"csc4",  eg: "192.168.0.211"                      ,kw:"172.30.175.111"},
{ name:"csc5",  eg: "192.168.0.201:7001"                 ,kw:"172.30.175.201:8892"},
{ name:"csc5",  eg: "192.168.0.125:8892"                 ,kw:"172.30.175.201:8892"},
{ name:"csc10", eg: "csc-cts-app-c01"                    ,kw:"172.30.175.111"},
{ name:"csc11", eg: "192.168.0.228"                      ,kw:"172.30.175.111"},
{ name:"csc12", eg: "192.168.0.229:8001"                 ,kw:"172.30.175.110:8001"}, 
];



export function updateUrl(url: string, env: string ): string{

	if(env == "eg") return url;

	//remove protocol
	let u1= url.replace("http://", "");

	//host and path
	let host= u1.split("/")[0];
	let path= u1.replace(host, "");

	//new host
	let newHost: string;
	let tmp= FirstWhere(servers, (s)=> {return s.eg == host});

	if(tmp == null){

		//split domain and port
		let domain= host.split(":")[0];
		let port = host.split(":")[1];

		//search with domain only
		let newDomain= FirstWhere(servers, (s)=> {return s.eg == domain}).kw;
		newHost= newDomain + ":" + port;
	}
	else{
		newHost= tmp.kw;
	}

	//log
	console.log("url ==>", url);
	console.log("u1 ==>", u1);
	console.log("host ==>", host);
	console.log("new host ==>", newHost);
	console.log("path ==>", path);

	//new url
	return "http://" + newHost + path;
}

function FirstWhere(array: any[], query: (t: any) => boolean): any {

    for (var i = 0; i < array.length; i++) {
        var item: any = array[i];
        if (query(item)) {
            return item;
        }
    }
    return null;
};
