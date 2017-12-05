var Globals = {
	connectionString:'postgresql://dbadmin:dl123@localhost:5432/quest',
	sourceFolder: 'F:/work/FE/export files/',
	outputFolder: 'F:/work/FE/B2B/test/',
	hashKey:'miaomiao',
	userData: null,
	menus: [{type:'Computer Networking',title:'计算机网络'},{type:'Software Enginerring',title:'软件工程'},{type:'Java',title:'基础习题'},
		{type:'sql',title:'Oracle'},{type:'SSH',title:'SSH'},{type:'NTC',title:'NTC'}],
	users: {
			  'admin':'pass@123','test':'123'
			}
}

module.exports = Globals;