
//==========================================================
//==========================MICROTEMPLATE===================
//==========================================================
function Microtemplate ( content , templateName )
{
	this._tmplCache = {};
	this.content = content;
	this.template_name = templateName;
}

Microtemplate.escape = function( str ) {
      if ( !isNull( str ) ) {       
        return (''+str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g,'&#x2F;');
      }else{
          return "";
      }
};

//backfill missing underscore functions...
if ( !window["_"] ) {
	window["_"] = {};
	window["_"].escape = Microtemplate.escape;	
}

Microtemplate.prototype.parse = function( data ) {
  var str = this.content;

  /// <summary>
  /// Client side template parser that uses &lt;#= #&gt; and &lt;# code #&gt; expressions.
  /// and # # code blocks for template expansion.
  /// NOTE: chokes on single quotes in the document in some situations
  ///       use &amp;rsquo; for literals in text and avoid any single quote
  ///       attribute delimiters.
  /// </summary>    
  /// <param name="str" type="string">The text of the template to expand</param>    
  /// <param name="data" type="var">
  /// Any data that is to be merged. Pass an object and
  /// that object's properties are visible as variables.
  /// </param>    
  /// <returns type="string" />
  
  ///UPDATE 2011_05_30 SFR
  ///if "p" is a variable within data this will fail
  ///I came up with some random variable name to fix.
  
  ///UPDATE 2015_02_25 SFR
  ///changed # to % to sync with JST node 

  var err = "";
  try {
      var func = this._tmplCache[str];
      if (!func) {

          var strFunc =
	            "var __tmplObj44=[],print=function(){__tmplObj44.push.apply(__tmplObj44,arguments);};" +
	                        "with(obj){__tmplObj44.push('" +
	            str.replace(/[\r\t\n]/g, " ")
	               .replace(/'(?=[^#]*#>)/g, "\t")
	               .split("'").join("\\'")
	               .split("\t").join("'")
                 .replace(/<%=(.+?)%>/g, "',$1,'")
	               .replace(/<%-(.+?)%>/g, "',mtpl.escape($1),'")
	               .split("<%").join("');")
	               .split("%>").join("__tmplObj44.push('")
	            //.replace(/<#==(.+?)#>/g, "',$1,'")
	               //.replace(/<#=(.+?)#>/g, "',mtpl.escape($1),'")
	               //.split("<#").join("');")
	               .split("#>").join("__tmplObj44.push('")
	               + "');}return __tmplObj44.join('');";

          func = new Function("obj", strFunc);
          this._tmplCache[str] = func;
      }
      data['template_name'] = this.template_name;
      return func(data);
  } catch (e) { err = e.message; console.log( e ); }    
  return "< # ERROR: [" + err + "] template:" + this.template_name + " # >";
};

var mtpl = Microtemplate;