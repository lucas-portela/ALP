var INDEF = "INDEFINIDO";
var TRUE = "V";
var FALSE = "F";
var Conclusoes = [];
var atualId = 0;
var Elementos=[];
var Variaveis=[];
var Constantes=[];
var Regras=[];
var sbmConjuncao="&";
var sbmDisjuncao="|";
var sbmImplicacao="->";
var sbmBiImplicacao="<->";
var sbmNegacao="~";
function AdicionarConstante(_ct)
{
    if(Constantes.indexOf(_ct)==-1)
	{
	    Constantes.push(_ct);
		InferirRegras();
	}
}
function AdicionarRegra(_r)
{
    if(Regras.indexOf(_r)==-1)Regras.push(_r);
}
function AdicionarVariavel(_vr)
{
    if(Variaveis.indexOf(_vr)==-1)Variaveis.push(_vr);
}
function AdicionarConclusao(_e) {
    conclusao='v('+_e.Nome+') = '+_e.Valor;
    if(Conclusoes.indexOf(conclusao)!=-1)return;
    Conclusoes[Conclusoes.length] = conclusao;
}
function GetId(e) {
	atualId=Elementos.length;
    Elementos[Elementos.length]=e;
	return atualId;
}
function Existe(nome){
	for(var i=0;i<Elementos.length;i++)
	{
	    if(Elementos[i].Nome==nome)return i;
	}
	return -1;
}
function TemCaracteres(str,caracteres)
{
    for(var i=0;i<caracteres.length;i++)
	{
	    if(str.indexOf(caracteres[i])!=-1)return true;
	}
	return false;
}

function IncArray(a,max)
{
    var i=0;
	while(true)
	{
	    if(i>=a.length)return false;
		if(a[i]>=(max-1))
		{
		    a[i]=0;
			i++;
		}
		else
		{
		    a[i]++;
			return a;
		}
	}
}

function InferirRegra(str)
{
    std=0;
	iV=0;
	t='t'.charCodeAt(0);
	vr='';
	while(true)
	{
    	if(iV>str.length)break;
		c=str.charAt(iV);
		switch(std)
		{
			case 0:
			    if(c.charCodeAt(0)>t&&c.charCodeAt(0)<='z'.charCodeAt(0))
				{
				    std++;
					vr+=c;
				}
				iV++;
				break;
			case 1:
			    if(((c.charCodeAt(0)>='0'.charCodeAt(0)&&c.charCodeAt(0)<='9'.charCodeAt(0)))&&(iV+1)<=str.length)
				{
				    vr+=c;
					iV++;
				}
				else std++;
				break
			case 2:
			    AdicionarVariavel(vr);
				std=0;
				vr='';
				break;
			default:
			    break;
		}
	}
	if(TemCaracteres(str,Variaveis))
	{
	    var pos=[];
		for(var i=0;i<Variaveis.length;i++)pos[i]=0;
		var ml=0;
		for(var i=0;i<Variaveis.length;i++)
		{
		    if(Variaveis.length>ml)ml=Variaveis.length;
		}
		vrs=[];
		while(true)
		{
		    if(ml<=0)break;
			var ae;
			for(var i=0;i<Variaveis.length;i++)
			{
				if(Variaveis[i].length==ml)
				{
				    ae=Variaveis[i];
					vrs.push(ae);
				}
			}
			ml--;
		}
		var s=str;
		var r=new Regra(str);
		if(Constantes.length<=0)return r;
		while(pos)
		{
		    continuar=true;
			for(var i=0;i<pos.length;i++)
			{
			    if(pos.indexOf(pos[i])==i)
				{
				    while(s.indexOf(vrs[i])!=-1)s=s.replace(vrs[i],Constantes[pos[i]]);
				}
				else continuar=false;
			}
			if(continuar)
			{
				//alert(s);
				e=Parse(s);
				e.Definir(r.Valor);
				r.Add(e);
			}
			pos=IncArray(pos,Constantes.length);
			s=str;
		}
		return r;
	}
	return false;
}

function InferirRegras()
{
    for(var i=0;i<Regras.length;i++)InferirRegra(Regras[i].toString());
}
function Parse(str2parse){
    var str=str2parse;
	var a=0;f=0;
	for(var i=0;i<str.length;i++)
	{
	    if(str.charAt(i)=="(")a++;
		else if(str.charAt(i)==")")f++;
	}
	if(f!=a)return false;
	while(str.indexOf(" ")!=-1)str=str.replace(" " ,"");
	var obj=false;
	obj=InferirRegra(str);
	if(obj)return obj;
	str="("+str+")";
	var i=0;
	var std=0;
	var formula="";
	var up;
	var std2=0;
	var formula3="";
	var i2=0;
	while(true)
	{
		var c2=str.charAt(i2);
		switch(std2)
		{
		    case 0:
			    if(c2!=sbmNegacao)i2++;
				else{i2++;std2++;}
				break;
			case 1:
			    if(c2!=sbmNegacao&&c2!=sbmConjuncao&&c2!=sbmDisjuncao&&c2!=sbmImplicacao.charAt(0)&&c2!=sbmBiImplicacao.charAt(0)&&c2!="("&&c2!=")"&&i2<str.length){formula3+=c2;i2++;}
				else std2++;
				break;
		    case 2:
				if(formula3.length>0)
				{
				    //alert(formula3);
					var A,C;
					if(isNaN(parseInt(formula3)))A=new Proposicao(formula3,[]);
					else A=Elementos[parseInt(formula3)];
					C=new Negacao(sbmNegacao+A,A);
					str=str.replace(sbmNegacao+formula3,C.Id);
					up=C;
				}
				std2=0;
				formula3="";
				break;
		}
		if(i2>str.length)break;
	}
	while(true)
	{
	    if(i>str.length)return up;
		var c=str.charAt(i);
		switch(std)
		{
		    case 0:
			    if(c==")")std++;
				else i++;
				break;
			case 1:
			    if(c=="(")std++;
				else i--;
				break;
			case 2:
			    if(c!=")"){formula+=c;i++;}
				else
				{
				    i=0;
					std++;
					formula+=")";
				}
				break;
			case 3:
				var formula2=formula.replace("(","").replace(")","");
				if(formula.indexOf(sbmConjuncao)!=-1)
				{
					var args=formula2.split(sbmConjuncao);
					var A,B;
					if(isNaN(parseInt(args[0])))A=new Proposicao(args[0],[]);
					else A=Elementos[parseInt(args[0])];
					if(isNaN(parseInt(args[1])))B=new Proposicao(args[1],[]);
					else B=Elementos[parseInt(args[1])];
					if(Existe("("+A+sbmConjuncao+B+")")!=-1)C=Elementos[Existe("("+A+sbmConjuncao+B+")")];
					else if(Existe("("+B+sbmConjuncao+A+")")!=-1)C=Elementos[Existe("("+B+sbmConjuncao+A+")")];
					else C=new Conjuncao("("+A+sbmConjuncao+B+")",A,B)
					while(str.indexOf(formula)!=-1)str=str.replace(formula,C.Id);
					//alert(str);
				}
				else if(formula.indexOf(sbmDisjuncao)!=-1)
				{
					var args=formula2.split(sbmDisjuncao);
					var A,B;
					if(isNaN(parseInt(args[0])))A=new Proposicao(args[0],[]);
					else A=Elementos[parseInt(args[0])];
					if(isNaN(parseInt(args[1])))B=new Proposicao(args[1],[]);
					else B=Elementos[parseInt(args[1])];
					if(Existe("("+A+sbmDisjuncao+B+")")!=-1)C=Elementos[Existe("("+A+sbmDisjuncao+B+")")];
					else if(Existe("("+B+sbmDisjuncao+A+")")!=-1)C=Elementos[Existe("("+B+sbmDisjuncao+A+")")];
					else C=new Disjuncao("("+A+sbmDisjuncao+B+")",A,B);
					while(str.indexOf(formula)!=-1)str=str.replace(formula,C.Id);
					//alert(str);
				}
				else if(formula.indexOf(sbmImplicacao)!=-1&&formula.indexOf(sbmBiImplicacao)==-1)
				{
					var args=formula2.split(sbmImplicacao);
					var A,B;
					if(isNaN(parseInt(args[0])))A=new Proposicao(args[0],[]);
					else A=Elementos[parseInt(args[0])];
					if(isNaN(parseInt(args[1])))B=new Proposicao(args[1],[]);
					else B=Elementos[parseInt(args[1])];
					C=new Implicacao("("+A+sbmImplicacao+B+")",A,B);
					while(str.indexOf(formula)!=-1)str=str.replace(formula,C.Id);
					//alert(str);
				}
				else if(formula.indexOf(sbmBiImplicacao)!=-1)
				{
					var args=formula2.split(sbmBiImplicacao);
					//alert(args[0]);
					var A,B;
					if(isNaN(parseInt(args[0])))A=new Proposicao(args[0],[]);
					else A=Elementos[parseInt(args[0])];
					if(isNaN(parseInt(args[1])))B=new Proposicao(args[1],[]);
					else B=Elementos[parseInt(args[1])];
					C=new BiImplicacao("("+A+sbmBiImplicacao+B+")",A,B);
					while(str.indexOf(formula)!=-1)str=str.replace(formula,C.Id);
					//alert(str);
				}
				else if(formula.indexOf(sbmNegacao)==-1)
				{
				    var C;
					if(isNaN(parseInt(formula2)))C=new Proposicao(formula2,[]);
					else C=Elementos[parseInt(formula2)];
					str=str.replace(formula,C.Id);
				}
				else break;
				std=0;
				up=C;
				formula="";
				i=0;
				break;
		}
		while(true)
		{
		    if(i2>str.length)break;
			var c2=str.charAt(i2);
			switch(std2)
			{
			    case 0:
				    if(c2!=sbmNegacao)i2++;
					else{i2++;std2++;}
					break;
				case 1:
				    if(c2!=sbmNegacao&&c2!=sbmConjuncao&&c2!=sbmDisjuncao&&c2!=sbmImplicacao.charAt(0)&&c2!=sbmBiImplicacao.charAt(0)&&c2!="("&&c2!=")"&&i2<str.length){formula3+=c2;i2++;}
					else std2++;
					break;
			    case 2:
					if(formula3.length>0)
					{
					    //alert(formula3);
						var A,C;
						if(isNaN(parseInt(formula3)))A=new Proposicao(formula3,[]);
						else A=Elementos[parseInt(formula3)];
						C=new Negacao(sbmNegacao+A,A);
						str=str.replace(sbmNegacao+formula3,C.Id);
					}
					std2=0;
					formula3="";
					break;
			}
		}
		i2=0;
		std2=0;
		formula3="";
	}
}

function Regra(_nome)
{
    if((ex=Existe(_nome))!=-1){
	    this.source=Elementos[Existe(_nome)];
		this.Nome=this.source.Nome;
		this.Id=this.source.Id;
		this.Tipo=this.source.Tipo;
		this.MasterUp=false;
		this.Valor=this.source.Valor;
		this.Add=function(_e){this.source.Add(_e);};
		this.AddUp=function(_up){this.source.AddUp(_up);};
		this.AnalizarUps=function(){this.source.MasterUp=this.MasterUp;source.AnalizarUps();this.MasterUp=source.MasterUp;}
		this.Analizar=function(){return this.source.Analizar();}
		this._Definir=function(_valor){return this.source._Definir(_valor);}
		this.Definir=function(_valor){return this.source.Definir(_valor);}
		this.toString=function(){return this.source.toString();};
		this.source.AddClone(this);
		this.AddClone=function(_clone){this.source.AddClone(_clone);}
		this.Analizar();
		return;
	}
	this.elementos=[];
	this.Id=GetId(this);
	this.Nome=_nome;
	this.Tipo='Regra';
	this.source=false;
	this.MasterUp=false;
	this.Variavel = TRUE;
	this.Valor=INDEF;
	this.up=[];
	this.Clones=[];
	AdicionarRegra(this);
	this.AddClone=function(_clone)
	{
	    this.Clones[this.Clones.length]=_clone;
	}
	this.RefreshClones=function()
	{
	    for(var i=0;i<this.Clones.length;i++)
		{
		    this.Clones[i].Valor=this.Valor;
		}
	}
    this.AddUp = function (_up) {
        this.up[this.up.length] = _up;
    }
    this.AnalizarUps = function () {
        for (var i = 0; i < this.up.length; i++) {
            if (this.MasterUp) { if (this.MasterUp.Id != this.up[i].Id) this.up[i].Analizar(); }
            else this.up[i].Analizar();
        }
        this.MasterUp = false;
    };
	this.Add=function(e)
	{
	    this.elementos.push(e);
	};
	this.Analizar=function()
	{
	    var v=TRUE;
		for(var i=0;i<this.elementos.length;i++)
		{
		    vp=this.elementos[i].Analizar();
			if(vp==FALSE)v=vp;
		}
		return v;
	};
	this._Definir=function(_valor)
	{
	    if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		var v=TRUE;
		for(var i=0;i<this.elementos.length;i++)
		{
		    vp=this.elementos[i]._Definir(_valor);
			if(vp==FALSE)v=vp;
		}
		if(v==TRUE)this.Valor=_valor;
		else return FALSE;
		this.RefreshClones();
        this.AnalizarUps();
        if(this.Valor==TRUE)AdicionarConclusao(this);
		else if(this.Valor==FALSE)AdicionarConclusao(this);
		else return FALSE;
        return TRUE;
	}
	this.Definir=function(_valor)
	{
	    if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		var v=TRUE;
		for(var i=0;i<this.elementos.length;i++)
		{
		    vp=this.elementos[i].Definir(_valor);
			if(vp==FALSE)v=vp;
		}
		if(v==TRUE)this.Valor=_valor;
		else return FALSE;
		this.RefreshClones();
        this.AnalizarUps();
        return TRUE;
	}
	this.toString=function(){return this.Nome;};
	this.Analizar();
}
function Proposicao(_nome,_args) {
    ex=Existe(_nome);
	if(ex!=-1){
	    this.source=Elementos[Existe(_nome)];
		this.SearchById=this.source.SearchById;
		this.Nome=this.source.Nome;
		this.Id=this.source.Id;
		this.Tipo=this.source.Tipo;
		this.Args=this.source.Args;
		this.MasterUp=false;
		this.Valor=this.source.Valor;
		this.AddUp=function(_up){this.source.AddUp(_up);};
		this.AnalizarUps=function(){this.source.MasterUp=this.MasterUp;source.AnalizarUps();this.MasterUp=source.MasterUp;}
		this.Analizar=function(){return this.source.Analizar();}
		this._Definir=function(_valor){return this.source._Definir(_valor);}
		this.Definir=function(_valor){return this.source.Definir(_valor);}
		this.toString=function(){return this.source.toString();};
		this.source.AddClone(this);
		this.AddClone=function(_clone){this.source.AddClone(_clone);}
		return;
	}
	this.Clones=[];
	this.AddClone=function(_clone)
	{
	    this.Clones[this.Clones.length]=_clone;
	}
	this.RefreshClones=function()
	{
	    for(var i=0;i<this.Clones.length;i++)
		{
		    this.Clones[i].Valor=this.Valor;
		}
	}
    this.Nome = _nome;
    this.Id = GetId(this);
    this.Tipo = "Proposicao";
    this.Args = _args;
    this.Valor = INDEF;
    this.up = [];
    this.Variavel = TRUE;
    this.MasterUp = false;
	this.SearchById=function(_id)
	{
	    if(this.Id==_id)return this;
		else return FALSE
	}
    this.AddUp = function (_up) {
        this.up[this.up.length] = _up;
    }
    this.AnalizarUps = function () {
        for (var i = 0; i < this.up.length; i++) {
            if (this.MasterUp) { if (this.MasterUp.Id != this.up[i].id) this.up[i].Analizar(); }
            else this.up[i].Analizar();
        }
        this.MasterUp = false;
    }
    this.Analizar = function () {
		return TRUE;
    }
    this._Definir = function (_valor) {
        if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		this.Valor=_valor;
		if(this.Analizar()==FALSE)return FALSE;
        this.Valor = _valor;
		this.RefreshClones();
        this.AnalizarUps();
        if(this.Valor==TRUE)AdicionarConclusao(this);
		else if(this.Valor==FALSE)AdicionarConclusao(this);
		else return FALSE;
        return TRUE;
    }
    this.Definir = function (_valor) {
	    if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
        this.Valor = _valor;
		if(this.Analizar()==FALSE)return FALSE;
		this.RefreshClones();
        this.AnalizarUps();
        return TRUE;
    }
    this.toString = function () {
        var str = this.Nome;
        for (var i = 0; i < this.Args.length; i++) {
            str += this.Args[i].toString();
        }
        return str;
    }
	std=0;
	iP=0;
	a='a'.charCodeAt(0);
	t='t'.charCodeAt(0);
	ct='';
	while(true)
	{
    	if(iP>_nome.length)break;
		c=_nome.charAt(iP);
		switch(std)
		{
			case 0:
			    if(c.charCodeAt(0)>=a&&c.charCodeAt(0)<=t)
				{
				    std++;
					ct+=c;
				}
				iP++;
				break;
			case 1:
			    if(((c.charCodeAt(0)>='0'.charCodeAt(0)&&c.charCodeAt(0)<='9'.charCodeAt(0))||(c.charCodeAt(0)<a&&c.charCodeAt(0)>t))&&(iP+1)<=_nome.length)
				{
				    ct+=c;
					iP++;
				}
				else std++;
				break
			case 2:
			    AdicionarConstante(ct);
				std=0;
				ct='';
				break;
			default:
			    break;
		}
	}
}
function BiImplicacao(_nome,_A, _B) {
    if(Existe(_nome)!=-1){
	    this.source=Elementos[Existe(_nome)];
		this.SearchById=this.source.SearchById;
		this.Nome=this.source.Nome;
		this.A=this.source.A;
		this.B=this.source.B;
		this.Id=this.source.Id;
		this.Tipo=this.source.Tipo;
		this.MasterUp=false;
		this.Valor=this.source.Valor;
		this.AddUp=function(_up){this.source.AddUp(_up);};
		this.AnalizarUps=function(){this.source.MasterUp=this.MasterUp;source.AnalizarUps();this.MasterUp=source.MasterUp;}
		this.Analizar=function(){return this.source.Analizar();}
		this._Definir=function(_valor){return this.source._Definir(_valor);}
		this.Definir=function(_valor){return this.source.Definir(_valor);}
		this.toString=function(){return this.source.toString();};
		this.source.AddClone(this);
		this.AddClone=function(_clone){this.source.AddClone(_clone);}
		return;
	}
	this.Clones=[];
	this.AddClone=function(_clone)
	{
	    this.Clones[this.Clones.length]=_clone;
	}
	this.RefreshClones=function()
	{
	    for(var i=0;i<this.Clones.length;i++)
		{
		    this.Clones[i].Valor=this.Valor;
		}
	}
    this.Nome = _nome;
    this.Id = GetId(this)
    this.Tipo = "BiImplicacao";
    this.A = _A;
    this.B = _B;
    this.A.AddUp(this);
    this.B.AddUp(this);
    this.up = [];
    this.Valor = INDEF;
    this.Variavel = TRUE;
    this.MasterUp = false;
	this.SearchById=function(_id)
	{
	    if(this.Id==_id)return this;
		var sa=this.A.SearchById(_id);
		if(sa)return sa;
		var sb=this.B.SearchById(_id);
		if(sb)return sb;
		return FALSE;
	}
    this.AddUp = function (_up) {
        this.up[this.up.length] = _up;
    }
    this.AnalizarUps = function () {
        for (var i = 0; i < this.up.length; i++) {
            if (this.MasterUp) { if (this.MasterUp.Id != this.up[i].Id) this.up[i].Analizar(); }
            else this.up[i].Analizar();
        }
        this.MasterUp = false;
    }
    this.Analizar = function () {
        if (this.Valor == INDEF) {
            if (this.A.Valor != INDEF && this.B.Valor != INDEF) {
                if (this.A.Valor == this.B.Valor) this._Definir(TRUE);
                else this._Definir(FALSE);
            }
            return TRUE;
        }
        
        if (this.A.Valor != INDEF && this.B.Valor == INDEF) {
            this.B.MasterUp = this;
            if (this.Valor == FALSE) {
                if (this.A.Valor == TRUE) { if (this.B._Definir(FALSE) == FALSE) return FALSE; }
                else if (this.B._Definir(TRUE) == FALSE) return FALSE;
            }
            else if (this.B._Definir(this.A.Valor) == FALSE) return FALSE;
        }
        else if (this.B.Valor != INDEF && this.A.Valor == INDEF) {
            this.A.MasterUp = this;
            if (this.Valor == FALSE) {
                if (this.B.Valor == TRUE) { if (this.A._Definir(FALSE) == FALSE) return FALSE; }
                else if (this.A._Definir(TRUE) == FALSE) return FALSE;
            }
            else if (this.A._Definir(this.B.Valor) == FALSE) return FALSE;
        }
		else if(this.B.Valor == INDEF && this.A.Valor == INDEF) return TRUE;
        else return FALSE;
        return TRUE;
    }
    this._Definir = function (_valor) {
        if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		this.Valor = _valor;
        if(this.Analizar()==FALSE)return FALSE;
		this.RefreshClones();
        this.AnalizarUps();
        if(this.Valor==TRUE||this.Valor==FALSE)AdicionarConclusao(this);
		else return FALSE;
        return TRUE;
    }
    this.Definir = function (_valor) {
        if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		this.Valor = _valor;
        if(this.Analizar()==FALSE)return FALSE;
		this.RefreshClones();
        this.AnalizarUps();
        return TRUE;
    }
    this.toString = function () {
        return "(" + this.A.toString() + sbmBiImplicacao + this.B.toString() + ")";
    }
	this.A.Analizar();
	this.B.Analizar();
}
function Implicacao(_nome, _A, _B) {
    if(Existe(_nome)!=-1){
	    this.source=Elementos[Existe(_nome)];
		this.SearchById=this.source.SearchById;
		this.Nome=this.source.Nome;
		this.A=this.source.A;
		this.B=this.source.B;
		this.Id=this.source.Id;
		this.Tipo=this.source.Tipo;
		this.MasterUp=false;
		this.Valor=this.source.Valor;
		this.AddUp=function(_up){this.source.AddUp(_up);};
		this.AnalizarUps=function(){this.source.MasterUp=this.MasterUp;source.AnalizarUps();this.MasterUp=source.MasterUp;}
		this.Analizar=function(){return this.source.Analizar();}
		this._Definir=function(_valor){return this.source._Definir(_valor);}
		this.Definir=function(_valor){return this.source.Definir(_valor);}
		this.toString=function(){return this.source.toString();};
		this.source.AddClone(this);
		this.AddClone=function(_clone){this.source.AddClone(_clone);}
		return;
	}
	this.Clones=[];
	this.AddClone=function(_clone)
	{
	    this.Clones[this.Clones.length]=_clone;
	}
	this.RefreshClones=function()
	{
	    for(var i=0;i<this.Clones.length;i++)
		{
		    this.Clones[i].Valor=this.Valor;
		}
	}
    this.Nome = _nome;
    this.Id = GetId(this)
    this.Tipo = "Implicacao";
    this.A = _A;
    this.B = _B;
    this.A.AddUp(this);
    this.B.AddUp(this);
    this.up = [];
    this.Valor = INDEF;
    this.Variavel = TRUE;
    this.MasterUp = false;
	this.SearchById=function(_id)
	{
	    if(this.Id==_id)return this;
		var sa=this.A.SearchById(_id);
		if(sa)return sa;
		var sb=this.B.SearchById(_id);
		if(sb)return sb;
		return FALSE;
	}
    this.AddUp = function (_up) {
        this.up[this.up.length] = _up;
    }
    this.AnalizarUps = function () {
        for (var i = 0; i < this.up.length; i++) {
            if (this.MasterUp) { if (this.MasterUp.Id != this.up[i].Id) this.up[i].Analizar(); }
            else this.up[i].Analizar();
        }
        this.MasterUp = false;
    }
    this.Analizar = function () {
        if (this.Valor == INDEF) {
            if (this.A.Valor != INDEF && this.B.Valor != INDEF) {
                if (this.A.Valor == FALSE || this.B.Valor == TRUE) this._Definir(TRUE);
                else this._Definir(FALSE);
            }
            return FALSE;
        }
        
        if (this.A.Valor != INDEF && this.B.Valor == INDEF) {
            this.B.MasterUp = this;
            if (this.Valor == TRUE) {
                if (this.A.Valor == TRUE) { if (this.B._Definir(TRUE) == FALSE) return FALSE; }
                else return TRUE;
            }
            else {
                if (this.A.Valor == TRUE) { if (this.B._Definir(FALSE) == FALSE) return FALSE; }
                else return FALSE;
            }
        }
        else if (this.B.Valor != INDEF && this.A.Valor == INDEF) {
            if (this.Valor == TRUE) {
                if (this.B.Valor == FALSE) { if (this.A._Definir(FALSE) == FALSE) return FALSE; }
                else return TRUE;
            }
            else {
                if (this.B.Valor == FALSE) { if (this.A._Definir(TRUE) == FALSE) return FALSE; }
                else return FALSE;
            }
        }
		else if(this.A.Valor == INDEF && this.A.Valor == INDEF)
		{
		    return TRUE;
			this.A.Analizar();
		    this.B.Analizar();
		}
        else return FALSE;
		return TRUE;
    }
    this._Definir = function (_valor) {
        if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		this.Valor = _valor;
        if(this.Analizar()==FALSE)return FALSE;
        this.RefreshClones();
        this.AnalizarUps();
        if(this.Valor==TRUE||this.Valor==FALSE)AdicionarConclusao(this);
		else return FALSE;
        return TRUE;
    }
    this.Definir = function (_valor) {
	    if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		this.Valor = _valor;
        if(this.Analizar()==FALSE)return FALSE;
        this.RefreshClones();
        this.AnalizarUps();
        return TRUE;
    }
    this.toString = function () {
        return "(" + this.A.toString() + sbmImplicacao + this.B.toString() + ")";
    }
	this.A.Analizar();
	this.B.Analizar();
}
function Conjuncao(_nome, _A, _B) {
    if(Existe(_nome)!=-1){
	    this.source=Elementos[Existe(_nome)];
		this.SearchById=this.source.SearchById;
		this.Nome=this.source.Nome;
		this.A=this.source.A;
		this.B=this.source.B;
		this.Id=this.source.Id;
		this.Tipo=this.source.Tipo;
		this.MasterUp=false;
		this.Valor=this.source.Valor;
		this.AddUp=function(_up){this.source.AddUp(_up);};
		this.AnalizarUps=function(){this.source.MasterUp=this.MasterUp;source.AnalizarUps();this.MasterUp=source.MasterUp;}
		this.Analizar=function(){return this.source.Analizar();}
		this._Definir=function(_valor){return this.source._Definir(_valor);}
		this.Definir=function(_valor){return this.source.Definir(_valor);}
		this.toString=function(){return this.source.toString();};
		this.source.AddClone(this);
		this.AddClone=function(_clone){this.source.AddClone(_clone);}
		return;
	}
	this.Clones=[];
	this.AddClone=function(_clone)
	{
	    this.Clones[this.Clones.length]=_clone;
	}
	this.RefreshClones=function()
	{
	    for(var i=0;i<this.Clones.length;i++)
		{
		    this.Clones[i].Valor=this.Valor;
		}
	}
    this.Nome = _nome;
    this.Id = GetId(this)
    this.Tipo = "Conjuncao";
    this.A = _A;
    this.B = _B;
    this.A.AddUp(this);
    this.B.AddUp(this);
    this.up = [];
    this.Valor = INDEF;
    this.Variavel = TRUE;
    this.MasterUp = false;
	this.SearchById=function(_id)
	{
	    if(this.Id==_id)return this;
		var sa=this.A.SearchById(_id);
		if(sa)return sa;
		var sb=this.B.SearchById(_id);
		if(sb)return sb;
		return FALSE;
	}
    this.AddUp = function (_up) {
        this.up[this.up.length] = _up;
    }
    this.AnalizarUps = function () {
        for (var i = 0; i < this.up.length; i++) {
            if (this.MasterUp) { if (this.MasterUp.Id != this.up[i].Id) this.up[i].Analizar(); }
            else this.up[i].Analizar();
        }
        this.MasterUp = false;
    }
    this.Analizar = function () {
        if (this.Valor == INDEF) {
            if (this.A.Valor != INDEF && this.B.Valor != INDEF) {
                if (this.A.Valor == TRUE && this.B.Valor == TRUE) this._Definir(TRUE);
                else this._Definir(FALSE);
            }
            return FALSE;
        }
        
        if (this.A.Valor == INDEF || this.B.Valor == INDEF) {
            this.B.MasterUp = this;
            if (this.Valor == TRUE) {
                if (this.A.Valor == INDEF&&this.B.Valor != FALSE) { if (this.A._Definir(TRUE) == FALSE) return FALSE; }
				else if (this.B.Valor == INDEF&&this.A.Valor != FALSE) { if (this.B._Definir(TRUE) == FALSE) return FALSE; }
                else return FALSE;
            }
            else {
                if (this.A.Valor == INDEF&&this.B.Valor == TRUE) { if (this.A._Definir(FALSE) == FALSE) return FALSE; }
				else if (this.B.Valor == INDEF&&this.A.Valor == TRUE) { if (this.B._Definir(FALSE) == FALSE) return FALSE; }
                else return TRUE;
            }
        }
        return TRUE;
    }
    this._Definir = function (_valor) {
        if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		this.Valor = _valor;
        if(this.Analizar()==FALSE)return FALSE;
        this.RefreshClones();
        this.AnalizarUps();
        if(this.Valor==TRUE||this.Valor==FALSE)AdicionarConclusao(this);
		else return FALSE;
        return TRUE;
    }
    this.Definir = function (_valor) {
	    if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
        this.Valor = _valor;
		if(this.Analizar()==FALSE)return FALSE;
        this.RefreshClones();
        this.AnalizarUps();
        return TRUE;
    }
    this.toString = function () {
        return "(" + this.A.toString() + sbmConjuncao + this.B.toString() + ")";
    }
	this.A.Analizar();
	this.B.Analizar();
}
function Disjuncao(_nome, _A, _B) {
    if(Existe(_nome)!=-1){
	    this.source=Elementos[Existe(_nome)];
		this.SearchById=this.source.SearchById;
		this.Nome=this.source.Nome;
		this.SearchById=this.source.SearchById;
		this.A=this.source.A;
		this.B=this.source.B;
		this.Id=this.source.Id;
		this.Tipo=this.source.Tipo;
		this.MasterUp=false;
		this.Valor=this.source.Valor;
		this.AddUp=function(_up){this.source.AddUp(_up);};
		this.AnalizarUps=function(){this.source.MasterUp=this.MasterUp;source.AnalizarUps();this.MasterUp=source.MasterUp;}
		this.Analizar=function(){return this.source.Analizar();}
		this._Definir=function(_valor){return this.source._Definir(_valor);}
		this.Definir=function(_valor){return this.source.Definir(_valor);}
		this.toString=function(){return this.source.toString();};
		this.source.AddClone(this);
		this.AddClone=function(_clone){this.source.AddClone(_clone);}
		return;
	}
	this.Clones=[];
	this.AddClone=function(_clone)
	{
	    this.Clones[this.Clones.length]=_clone;
	}
	this.RefreshClones=function()
	{
	    for(var i=0;i<this.Clones.length;i++)
		{
		    this.Clones[i].Valor=this.Valor;
		}
	}
    this.Nome = _nome;
    this.Id = GetId(this)
    this.Tipo = "Disjuncao";
    this.A = _A;
    this.B = _B;
    this.A.AddUp(this);
    this.B.AddUp(this);
    this.up = [];
    this.Valor = INDEF;
    this.Variavel = TRUE;
    this.MasterUp = false;
	this.SearchById=function(_id)
	{
	    if(this.Id==_id)return this;
		var sa=this.A.SearchById(_id);
		if(sa)return sa;
		var sb=this.B.SearchById(_id);
		if(sb)return sb;
		return FALSE;
	}
    this.AddUp = function (_up) {
        this.up[this.up.length] = _up;
    }
    this.AnalizarUps = function () {
        for (var i = 0; i < this.up.length; i++) {
            if (this.MasterUp) { if (this.MasterUp.Id != this.up[i].Id) this.up[i].Analizar(); }
            else this.up[i].Analizar();
        }
        this.MasterUp = false;
    }
    this.Analizar = function () {
		if (this.Valor == INDEF) {
			if (this.A.Valor == TRUE || this.B.Valor == TRUE) {
                this._Definir(TRUE);
            }
			else if(this.A.Tipo=="Negacao"&&this.A.A.Id==this.B.Id)this._Definir(TRUE);
			else if(this.B.Tipo=="Negacao"&&this.B.A.Id==this.A.Id)this._Definir(TRUE);
			else if(this.A.Valor == INDEF||this.B.Valor == INDEF)return TRUE;
			else this._Definir(FALSE);
            return TRUE;
        }
        
		if(this.Valor==TRUE)
		{
		    if(this.A.Tipo=="Conjuncao"&&this.B.Tipo=="Conjuncao")
			{
			    if(this.A.A.Id==this.B.A.Id||this.A.A.Id==this.B.B.Id)this.A.A._Definir(TRUE);
				if(this.A.B.Id==this.B.A.Id||this.A.B.Id==this.B.B.Id)this.A.B._Definir(TRUE);
			}
		}
        if (this.A.Valor != INDEF && this.B.Valor == INDEF) {
            this.B.MasterUp = this;
            if (this.Valor == TRUE) {
                if (this.A.Valor == FALSE) { if (this.B._Definir(TRUE) == FALSE) return FALSE; }
                else return TRUE;
            }
            else {
                if (this.A.Valor == FALSE) { if (this.B._Definir(FALSE) == FALSE) return FALSE; }
                else return FALSE;
            }
        }
        else if (this.B.Valor != INDEF && this.A.Valor == INDEF) {
            this.A.MasterUp = this;
			if (this.Valor == TRUE) {
                if (this.B.Valor == FALSE) { if (this.A._Definir(TRUE) == FALSE) return FALSE; }
                else return TRUE;
            }
            else {
                if (this.B.Valor == FALSE) { if (this.A._Definir(FALSE) == FALSE) return FALSE; }
                else return FALSE;
            }
        }
		else if (this.A.Valor == INDEF && this.B.Valor == INDEF) {
		    if(this.Valor==FALSE)
			{
			    this.A.MasterUp=this;
				this.B.MasterUp=this;
				this.A._Definir(FALSE);
				this.B._Definir(FALSE);
			}
		}
		else if(this.A.Valor==TRUE||this.B.Valor==TRUE)return TRUE;
        else return FALSE;
    }
    this._Definir = function (_valor) {
        if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		this.Valor = _valor;
        if(this.Analizar()==FALSE)return FALSE;
        this.RefreshClones();
        this.AnalizarUps();
        if(this.Valor==TRUE||this.Valor==FALSE)AdicionarConclusao(this);
		else return FALSE;
        return TRUE;
    }
    this.Definir = function (_valor) {
	    if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
		this.Valor = _valor;
        if(this.Analizar()==FALSE)return FALSE;
        this.RefreshClones();
        this.AnalizarUps();
        this.RefreshClones();
        return TRUE;
    }
    this.toString = function () {
        return "(" + this.A.toString() + sbmDisjuncao + this.B.toString() + ")";
    }
	this.A.Analizar();
	this.B.Analizar();
}
function Negacao(_nome, _A) {
    if(Existe(_nome)!=-1){
	    this.source=Elementos[Existe(_nome)];
		this.SearchById=this.source.SearchById;
		this.Nome=this.source.Nome;
		this.A=this.source.A;
		this.Id=this.source.Id;
		this.Tipo=this.source.Tipo;
		this.MasterUp=false;
		this.Valor=this.source.Valor;
		this.AddUp=function(_up){this.source.AddUp(_up);};
		this.AnalizarUps=function(){this.source.MasterUp=this.MasterUp;source.AnalizarUps();this.MasterUp=source.MasterUp;}
		this.Analizar=function(){return this.source.Analizar();}
		this._Definir=function(_valor){return this.source._Definir(_valor);}
		this.Definir=function(_valor){return this.source.Definir(_valor);}
		this.toString=function(){return this.source.toString();};
		this.source.AddClone(this);
		this.AddClone=function(_clone){this.source.AddClone(_clone);}
		return;
	}
	this.Clones=[];
	this.AddClone=function(_clone)
	{
	    this.Clones[this.Clones.length]=_clone;
	}
	this.RefreshClones=function()
	{
	    for(var i=0;i<this.Clones.length;i++)
		{
		    this.Clones[i].Valor=this.Valor;
		}
	}
    this.Nome = _nome;
    this.Id = GetId(this)
    this.Tipo = "Negacao";
    this.A = _A;
    this.A.AddUp(this);
    this.up = [];
    this.Valor = INDEF;
    this.Variavel = TRUE;
    this.MasterUp = false;
	this.SearchById=function(_id)
	{
	    if(this.Id==_id)return this;
		var sa=this.A.SearchById(_id);
		if(sa)return sa;
		return FALSE;
	}
    this.AddUp = function (_up) {
        this.up[this.up.length] = _up;
    }
    this.AnalizarUps = function () {
        for (var i = 0; i < this.up.length; i++) {
            if (this.MasterUp) { if (this.MasterUp.Id != this.up[i].Id) this.up[i].Analizar(); }
            else this.up[i].Analizar();
        }
        this.MasterUp = false;
    }
    this.Analizar = function () {
        if (this.Valor == INDEF) {
            if (this.A.Valor != INDEF) {
                if (this.A.Valor == FALSE) this._Definir(TRUE);
                else this._Definir(FALSE);
            }
            return FALSE;
        }
        
        if (this.A.Valor == INDEF) {
            this.A.MasterUp = this;
            if (this.Valor == TRUE) {if (this.A._Definir(FALSE) == FALSE) return FALSE; }
            else if (this.A._Definir(TRUE) == FALSE) { return FALSE; }
        }
        else if(this.Valor==this.A.Valor)return FALSE;
		else return TRUE;
    }
	this._Analizar = function () {
        if (this.Valor == INDEF) {
            if (this.A.Valor != INDEF) {
                if (this.A.Valor == FALSE) this.Definir(TRUE);
                else this.Definir(FALSE);
            }
            return FALSE;
        }
        
        if (this.A.Valor == INDEF) {
            this.A.MasterUp = this;
            if (this.Valor == TRUE) {if (this.A.Definir(FALSE) == FALSE) return FALSE; }
            else if (this.A.Definir(TRUE) == FALSE) { return FALSE; }
        }
        else if(this.Valor==this.A.Valor)return FALSE;
		else return TRUE;
    }
    this._Definir = function (_valor) {
		if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
        this.Valor = _valor;
		if(this.Analizar()==FALSE)return FALSE;
        this.RefreshClones();
        this.AnalizarUps();
		if(this.A.Tipo==this.Tipo)return TRUE;
        if(this.Valor==TRUE)AdicionarConclusao("&there4;~"+this.A.Nome);
        else if(this.Valor==FALSE)AdicionarConclusao("&there4;"+this.A.Nome);
		else return FALSE;
        return TRUE;
    }
    this.Definir = function (_valor) {
	    if(this.Valor!=_valor&&this.Valor!=INDEF)return FALSE;
		else if(this.Valor==_valor)return TRUE;
        this.Valor = _valor;
		if(this.Analizar()==FALSE)return FALSE;
        this.RefreshClones();
        this.AnalizarUps();
        return TRUE;
    }
    this.toString = function () {
        return sbmNegacao + this.A;
    }
    this.A.Analizar();
}