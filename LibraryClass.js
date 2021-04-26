class AnswerLibrary {
	    constructor(name){
	      this.name = name
	      this.Library = {title:'',tags:[],QA:{}} // Library:{ title, tags, QA:{ id:{ q, a, t} } }
	      }
	    printAll(func = (id,q,a,t)=>{console.log(`ID:${id}\n${q}\nA: ${a}`)})
	    {
	       	try{
	        	for(let _id in this.Library.QA)
	        	func(_id,	this.Library.QA[_id].q,
	        				this.Library.QA[_id].a, 
	        				(this.Library.QA[_id].hasOwnProperty('t') ? this.Library.QA[_id].t : "")
	        				)
	        }catch(Error){
	        	this.setLocal()
	       	}
	    }
	    setLibrary(lib){
	    	this.Library.QA=lib.QA
	    	this.Library.title=lib.title
	    	this.Library.tags=lib.tags
	    }
	    appendLibrary(lib,title=false){
	    	for(let qa in lib.QA){
	    		this.addQA(lib.QA[qa].q, lib.QA[qa].a, lib.QA[qa].t)
	    	}
	    	this.Library.tags=this.Library.tags.concat(lib.tags)
	    	if(title) this.Library.title=lib.title
	    }
	    loadLocal(){
	      try{
		      this.Library = JSON.parse( localStorage.getItem(this.name) )
		      return true
	      }catch(error){
		      console.error( 'loaded Library couldn\'t be parsed\n',error)
		      return false
	      }
	      }
	    checkLocal(){
	    	let lib
	    	try{
	    		lib=JSON.parse( localStorage.getItem(this.name) ).hasOwnProperty('QA')
	    	}catch(e){
	    		lib=false
	    	}
	       return lib
	    }
	    set title(title){
	       this.Library.title=title
	    }
	    get title(){
	       return this.Library.title
	    }
	    getLibJSON(){
	      	return JSON.stringify(this.Library)
	    }
	    setLocal(){
		    try{
		    localStorage.setItem(this.name,this.getLibJSON())
		    return true
		    }catch(error){
		    console.error( 'Library couldn\'t be stringified\n',error)
		    return false
		    }
	    }
	    addQA(question,answer,tags=""){
	    	//Random ID generator
		    let newID =(chars) => {
		        var result = chars[Math.floor(Math.random() * 25)];
		        for (var i = 4; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length - 1)];
		        return result.toLowerCase();
		    }
		    let id = newID('qwertyuiopasdfghjklzxcvbnm1234567890')
		    //checks for non-existing library to prevent duplicate ID
		    while (this.Library.QA.hasOwnProperty(id)) newID('1234567890qwertyuiopasdfghjklzxcvbnm')
	    
	    	this.Library.QA[id]={}
	    	this.Library.QA[id].q=question
	    	this.Library.QA[id].a=answer
	    	if (tags != "") this.Library.QA[id].t=tags
	    }
		setQA(id,question,answer,tags){
			if (this.Library.QA.hasOwnProperty(id)){
				this.Library.QA[id].q=question
	    		this.Library.QA[id].a=answer
	    		this.Library.QA[id].t=tags
			}else console.error(`setQA: ${id} not found in Library!`)
		}
	  	addTag(tags){
	  		for (tag of tags)
	  		if (!this.Library.tags.includes(tag.toUpperCase())) this.Library.tags.push(tag.toUpperCase())
	  	}
	    deleteQA(id){
	      try{
		      delete this.Library.QA[id]
		      return true
	      }catch(error){
		      console.error( 'Library Question and Answer couldn\'t be deleted(May not Exist)\n',error)
		      return false
	      }
      	}
      	createElement(obj,parent=false){
			if ('tag' in obj ? typeof obj.tag === 'string' : false) {

				var element = document.createElement(obj.tag)

				if ('attribute' in obj) for(var att in obj.attribute){
					if (typeof obj.attribute[att] === 'string') element.setAttribute(att.toString(),obj.attribute[att])
				}
				if ('child' in obj) for (var child of obj.child){

					if (typeof child === 'string') element.innerHTML+=child

					if (this.isNode(child)) element.appendChild(child)
				}

				if (this.isNode(parent))	parent.appendChild(element)

				else if (this.isNode(document.querySelector(parent))) document.querySelector(parent).appendChild(element)

				return element
			} else console.error('Engine.$make(obj) obj parameter must atleast include: tag!!!')
			
		}
		isNode(child){
			return typeof Node === "object" ? child instanceof Node : child && typeof child === "object" && typeof child.nodeType === "number" && typeof child.nodeName==="string"
		}
      }