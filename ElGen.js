/** ElGen, a javascript based element generator.
 ** Generates elements according to template
 **/
var ElGen = {
	version: "1.2",
	cur: {}, //stores temp data
	path: [], //stores path nodes
	config: {}, //config temp overwrite
	run: function(_template,_data,_config) { //create element
		if (_config) {
			ElGen.config = _config;
		}
		else ElGen.config = {};
		if (_data.push) { //test if _data is an array
			var _res = [];
			for (var _i of _data) {
				_res.push(ElGen.realRun(_template,_i));
			}
			return _res;
		}
		else {
			return ElGen.realRun(_template,_data);
		}
	},
	realRun: function(_template, _data) {
		ElGen.cur = _data;
		ElGen.path = [];
		ElGen.core(_template);
		return ElGen.path[0];
	},
	core: function(_rec) {
		if (_rec==null||(typeof _rec)!="object") return;
		_elem = document.createElement(_rec.node);
		if (ElGen.path.length>0) {
			ElGen.path[ElGen.path.length-1].appendChild(_elem);
		}
		ElGen.path.push(_elem);
		if (_rec.attr) {
			for (var _i in _rec.attr) {
				_elem.setAttribute(_i, ElGen.proc(_rec.attr[_i]));
			}
		}
		if (_rec.html) {
			_elem.innerHTML = ElGen.proc(_rec.html);
		}
		if (_rec.children){
			for (var _i of _rec.children) {
				ElGen.core(_i);
				ElGen.path.pop();
			}
		}
	},
	proc: function(_wd) {
		var _ans = _wd;
		var _shift = 0;
		while (_wd.indexOf("$")!=-1) {
			var _begin = _wd.indexOf("$");
			var _tmp = _wd.slice(_begin+1,_wd.length);
			var _end = _tmp.indexOf("$");
			if (_end==-1) {
				break;
			}
			_tmp = _wd.slice(_begin+1,_begin+_end+1);
			if (ElGen.cur[_tmp]!=null){
				ElGen.cur[_tmp] = ElGen.cur[_tmp].toString();
				_ans = _ans.slice(0,_shift+_begin) + ElGen.cur[_tmp] + _ans.slice(_shift+_begin+_end+2,_ans.length);
				_shift -= _end+2-ElGen.cur[_tmp].length;
			}
			else if (ElGen.config.strictReplace) {
				_ans = _ans.slice(0,_shift+_begin) + _ans.slice(_shift+_begin+_end+2,_ans.length);
				_shift -= _end+2;
			}
			_wd = _wd.slice(_begin+_end+2,_wd.length);
			_shift += _begin+_end+2;
		}
		return _ans;
	}
}
var tmpl = {
	node: "p",
	attr: {"style":"color:$color$"},
	html: "dropdownClick($listId$,$id$,'delete')",
	children: [
		{
			node: "span",
			attr: {"style":"color:green"},
			html: "nice day!"
		}
	]
}