function blk(){
	let _cards
	_cards = document.getElementsByClassName('card').length
	return document.querySelector(`#blk${_cards%2}`)
}
function toggleSelected(me){
	ref = selected.indexOf(me.value)
	if (me.checked && ref==-1) selected.push(me.value)
	else if (!me.checked && ref!=-1) selected.splice(ref,1)
	updateSelection()
}
function openEditForm(toggle){
	let heading = document.querySelector('#cardForm h1')
	let saveCard = document.querySelector('button#saveCard')
	let id = selected[selected.length-1]

	heading.innerText= toggle? 'Edit Card':'New Card'
	saveCard.classList.toggle('inactiveButton', !toggle)
	resetAddCardInterface()	
	if(lib.Library.QA.hasOwnProperty(id)){
		get.q().innerText=lib.Library.QA[id].q
		get.a().innerText=lib.Library.QA[id].a
		get.t().value=lib.Library.QA[id].t === undefined ? "":lib.Library.QA[id].t
	}

}
function updateSelection(){
	document.querySelector('.selection.label span').textContent=selected.length
	for (item of document.querySelectorAll('.card .selector'))
		document.querySelector(`#${item.value} .selector`).checked=selected.includes(item.value)
	toggleSelectedUI()
}
function toggleSelectedUI(){
	let sui = document.querySelector('#selection').classList
	let aui = document.querySelector('#selection').classList
	if (selected.length > 0){
		sui.toggle('active',true)
		openEditForm(true)
	}		
	else if (selected.length == 0) {
		sui.toggle('active',false)
		openEditForm(false)
	}
}

function makeCard(id,question,answer,tags){
	// .card
	parent = lib.createElement({tag:'div',attribute:{'id':id,class:'card'}},blk())
	// .card span.tags
	if (tags !== "") lib.createElement({tag:'span',child:tags,attribute:{class:'tag'}},parent)
	// .card input[type:checkbox]
	lib.createElement({tag:'input',attribute:{class:'selector', type:'checkbox', value:id,}},parent).addEventListener('click',function(event){toggleSelected(event.target)})
	// .card div.question
	lib.createElement({tag:'div',attribute:{class:'question'}},parent).appendChild(lib.createElement({tag:'span',child:question}))
	// .card div.answer
lib.createElement({tag:'div',attribute:{class:'answer'}},parent).appendChild(lib.createElement({tag:'span',child:answer}))
}

function selectedAll(){
	selectedClear()
	for(item of document.querySelectorAll(`.card .selector`))
		selected.push(item.value)
		item.checked=true
	updateSelection()
}
function selectedClear(){
	selected.splice(0,selected.length)
	updateSelection()
}
function removeSelected(){
	let n=selected.length
	if(n!=0)
	if(confirm(`Do you want to remove the ${n} selected card${n<2?"":"s"}?`)){
		for(cards of selected)
			lib.deleteQA(cards)
		selectedClear()
		Init()
	}
	lib.setLocal()
}
function varWatch(a){
	console.log('varWatch(): ',a)
	return a
}
function addCard(q,a,t=""){
	let qp=q.getAttribute('placeholder').trim(),
		ap=a.getAttribute('placeholder').trim()

	q=q.innerText.trim()
	a=a.innerText.trim()
	
	t=t.value.trim()

	if ( q !== "" && q !== qp  && a !== "" && a !== ap ){
		lib.addQA(q,a,t)
		lib.setLocal()
		Init()

		console.log("addCard()\n",{
			Question:q,
			Answer:a,
			Tags:t
		})
	}
	
	else alert('Question and Answer can\'t be empty')
}

function Init(){
	for(i=0;i<2;i++)
	while(document.querySelector(`#blk${i}`).firstChild)
	document.querySelector(`#blk${i}`).removeChild(document.querySelector(`#blk${i}`).firstChild)
	resetAddCardInterface()
	lib.printAll(makeCard)
	updateSelection()
}

function textBoxPlaceholder(element,placeholder){ // makeshift placeholder
	if (element.textContent.trim() == placeholder.trim())
		element.innerText=""
	else if (element.textContent.trim() == "")
		element.innerText=placeholder
}

function initTextBox(element,placeholder){
	element.textContent=placeholder
	for(events of ['blur','focus']) 
		element.addEventListener(events,function(event){textBoxPlaceholder(event.target,placeholder)})
}

function resetAddCardInterface(){
	for(element of document.getElementsByClassName('textbox')) {
		if (element.localName == 'input') element.value=""
		else element.textContent = element.getAttribute('placeholder')
	}
}
function editCard(q,a,t=""){
	let qp=q.getAttribute('placeholder').trim(),
		ap=a.getAttribute('placeholder').trim(),
		id=selected[selected.length-1]

	q=q.innerText.trim()
	a=a.innerText.trim()
	
	t=t.value.trim()

	if ( q !== "" && q !== qp  && a !== "" && a !== ap ){
		lib.setQA(id,q,a,t)
		lib.setLocal()
		Init()

		console.log("editCard()\n",{
			Question:q,
			Answer:a,
			Tags:t
		})
	}
	
	else alert('Question and Answer can\'t be empty')
}
// title
function titleUpdateUI(){
	let headerTitle = document.querySelector('header .title')
	let headTitle = document.querySelector('head title')
	headerTitle.value=lib.title
	headTitle.textContent=`Library \\ ${lib.title.trim() == ""? "Untitled" : lib.title.trim()}`
}
function titleChanged(event){
	lib.title=event.target.value
	lib.setLocal()
	console.log(lib.title)
	titleUpdateUI()
}

const lib = new AnswerLibrary('reviewer')
const selected=[]
//interface Tabs UI
const itab={
	tabset:['file','edit','about'],
	active:'edit',
	update:function(){
		let act = document.querySelector(`#${itab.active}`)
		for (id of itab.tabset) if (id != itab.active) document.querySelector(`#${id}`).classList.remove('active')
		if (!act.classList.contains('active')) act.classList.add('active')
	},
	updateTab:function(tab){
		for (tabs of tab.parentElement.children)
			if (tabs.classList.contains('activetab')) 
				tabs.classList.remove('activetab')
		tab.classList.toggle('activetab')
	},
	onclickTab:function(event){
		itab.updateTab(event.target)
		itab.active=itab.tabset[event.target.getAttribute('tab')]
		itab.update()
	}
}

const get={
	q:function(){
		return document.querySelector('section#edit .question .textbox')
	},
	a:function(){
		return document.querySelector('section#edit .answer .textbox')
	},
	t:function(){
		return document.querySelector('section#edit .tags .textbox')
	}
}

for(element of document.getElementsByClassName('textbox')) {
	if (element.localName == 'input') continue;
	initTextBox(element, element.getAttribute('placeholder'))
}

document.querySelector('header .title').addEventListener('change',titleChanged)

const file={
	openForm:'normal',//normal or append
	onReaderLoad:()=>{
		console.log(event.target.result);
        var obj = JSON.parse(event.target.result);
        switch (file.openForm){
        	case 'append':
        		lib.appendLibrary(obj)
        	break;
        	default:
        		lib.setLibrary(obj)
        }
        document.querySelector('#openFile').setAttribute('type','')
        document.querySelector('#openFile').setAttribute('type','file')
       	Init()
	},
	files:document.querySelector('#openFile').files,
	open:(event)=>{
		let reader = new FileReader();
        reader.onload = file.onReaderLoad;
        reader.readAsText(event.target.files[0]);

	},
	saveFunction:(exportObj, exportName)=>{
    var dataStr = "data:text/json;charset=utf-8," + exportObj
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href",     dataStr)
    downloadAnchorNode.setAttribute("download", (exportName == "" ? "Untitled":exportName) + ".json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    },
	save:()=>{
    	file.saveFunction(encodeURIComponent(JSON.stringify(lib.Library)),lib.Library.title)
  }
}

//set File < open (buttons)
document.querySelector('#openFile').addEventListener('change',file.open)

//onload
itab.update()
titleUpdateUI()
document.querySelectorAll('.tabs')[itab.tabset.indexOf(itab.active)].classList.add('activetab')

for (tabs of document.querySelectorAll('.tabs'))
	tabs.addEventListener('click',function(event){
		itab.onclickTab(event)
	})

if (lib.checkLocal()) lib.loadLocal()
Init()