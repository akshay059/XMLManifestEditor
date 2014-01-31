var relatedLocales = [['en_US', 'en_GB', 'en_AE', 'en_IL'], ['es_ES', 'es_MX'], ['fr_FR', 'fr_MA', 'fr_CA']]
var localeList = [
    'de_DE', 'fr_FR', 'fr_MA', 'fr_CA',
    'es_ES', 'es_MX', 'it_IT', 'nl_NL', 'sv_SE', 'nb_NO', 'da_DK', 'fi_FI', 'pt_BR',
    'ru_RU', 'uk_UA', 'cs_CZ', 'pl_PL', 'hu_HU', 'tr_TR', 
    'ja_JP', 'zh_CN', 'zh_TW', 'ko_KR', 'en_US', 'en_GB', 'en_AE', 'en_IL']

function handleSelectXMLSource() {
    changeXMLSource()
}

var xSource = "Server"
function changeXMLSource(){
    if (xSource == "Server"){
        xSource = "Local"
        $('#fileSelectorForm')[0].style.display = "inline"
        $('#loadFromServerForm')[0].style.display = "none"
        $('#selectXMLSource')[0].textContent = "Source :  Local"
    }else{
        xSource = "Server"
        $('#fileSelectorForm')[0].style.display = "none"
        $('#loadFromServerForm')[0].style.display = "inline"
        $('#selectXMLSource')[0].textContent = "Source : Server"
    }
}

function handleFileSelect(evt) {
    var f = evt.target.files[0] // File Object
    // Loop through the FileList and render image files as thumbnails.
    readFileToString(f)
}

function readFileToString(f){
    var reader = new FileReader()
    var start = 0
    var stop = f.size - 1
    reader.onloadend = function () {
        xData = reader.result
        setXMLData(xData)
        parseXML()
        showForm()
    };
    reader.readAsText(f)
}

function setXMLData(xString){
    document.xmlData = xString
}

function parseXML(xmlData) {
    var dp = new DOMParser()
    if (!xmlData) {
        xmlData = document.xmlData
    }
    document.xDoc = dp.parseFromString(document.xmlData, "text/xml")
}

//________________________________________Form Display and Background XML Update Related Code_________________________________//

var indexForVariableData = 0;
var firstRun = true

function showForm(xDoc) {
    //resetting the index on changing source of XML
    indexForVariableData = 0;
    //resetting tables on changing source of XML
    resetAllForms()
    if (!xDoc) {
        xDoc = document.xDoc
    }
    //other fields
    manifestNode = $("Manifest", document.xDoc)[0]
    recursiveForm(manifestNode, 0)
    fillDisplayNameForm()
    fillDescriptionForm()
    displayTableAndForms()
	removeSpellCheckFromFields()
    setOnBlurListeners()
}

function resetAllForms() {
    $("#displayNameForm tbody").empty()
    $("#descriptionForm tbody").empty()
    $("#otherDataForm tbody").empty()
    $("#detectedVersions").empty()
    //$('#title-description')[0].style.display = "none";
    //$('#otherDataForm')[0].style.display = "none";
    //$("#replaceVersionForm")[0].style.display = "none";
}

function fillDisplayNameForm() {
    //display name related code
    displayName = $("DisplayName", document.xDoc)[0]
    $("#displayNameForm").append('<tr id=' + displayName.attributes[0].name + '><td>' + displayName.attributes[0].name + '</td><td class="editable" id="' + ++indexForVariableData + '" contenteditable>' + displayName.attributes[0].value + '</td></tr>')
    $("#" + indexForVariableData)[0].xObject = displayName.attributes[0]
    $("#" + indexForVariableData)[0].xObject.domObject = $("#" + indexForVariableData)[0]

    children = displayName.children
    for (i = 0; i < children.length; i++) {
        $("#displayNameForm").append('<tr id=' + children[i].tagName + '><td>' + children[i].tagName + '</td><td class="editable" id="' + ++indexForVariableData + '" contenteditable>' + children[i].textContent + '</td></tr>')
        $("#" + indexForVariableData)[0].xObject = children[i]
        $("#" + indexForVariableData)[0].xObject.domObject = $("#" + indexForVariableData)[0]
    }
}

function fillDescriptionForm() {
    //description related code
    descriptionNode = $("Description", document.xDoc)[0]
    $("#descriptionForm").append('<tr id=' + descriptionNode.attributes[0].name + '><td>' + descriptionNode.attributes[0].name + '</td><td class="editable" id="' + ++indexForVariableData + '" contenteditable>' + descriptionNode.attributes[0].value + '</td></tr>')
    descriptionNode.attributes[0].index = indexForVariableData
    $("#" + indexForVariableData)[0].xObject = descriptionNode.attributes[0]
    $("#" + indexForVariableData)[0].xObject.domObject = $("#" + indexForVariableData)[0]

    children = descriptionNode.children
    for (i = 0; i < children.length; i++) {
        $("#descriptionForm").append('<tr id=' + children[i].tagName + '><td>' + children[i].tagName + '</td><td class="editable" id="' + ++indexForVariableData + '" contenteditable>' + children[i].textContent + '</td></tr>')
        $("#" + indexForVariableData)[0].xObject = children[i]
        $("#" + indexForVariableData)[0].xObject.domObject = $("#" + indexForVariableData)[0]
    }
}

function displayTableAndForms() {
    //display table
    if (firstRun) {
        $("#title-description")[0].style.display = "table"
        firstRun = false
    }
    if ($("#replaceVersionForm")[0].style.display == "inline") {
        fillDetectedVersions()
    }
}

function removeSpellCheckFromFields(){
    cells = $("td")
    for (i = 0; i < cells.length; i++) {
        cells[i].spellcheck = 0
    }
}

function recursiveForm(root, depth) {
    depthmarker = ""
    for (var i = 0; i < depth; i++) {
        depthmarker = depthmarker.concat("-")
    }
    if (root.tagName != "DisplayName" && root.tagName != "Description") {
        if (root.children.length > 0 || root.attributes.length > 0)
            $("#otherDataForm").append('<tr id=' + root.tagName + ' class="aloneroot"><td>' + depthmarker + " " + root.tagName + '</td></tr>')

        if (root.attributes.length > 0) {
            for (var i = 0; i < root.attributes.length; i++) {
                $("#otherDataForm").append('<tr id=' + root.attributes[i].name + '><td>' + depthmarker + " " + root.attributes[i].name + '</td><td><div class="attributes" id="' + ++indexForVariableData + '" contenteditable>' + root.attributes[i].value + '</div></td></tr>')
                $("#" + indexForVariableData)[0].xObject = root.attributes[i]
                $("#" + indexForVariableData)[0].xObject.domObject = $("#" + indexForVariableData)[0]
            }
        }

        if (root.children.length < 1) {
            $("#otherDataForm").append('<tr id=' + root.tagName + '><td>' + depthmarker + " " + root.tagName + '</td><td><div class="editable" id="' + ++indexForVariableData + '" contenteditable>' + root.textContent + '</div></td></tr>')
            $("#" + indexForVariableData)[0].xObject = root
            $("#" + indexForVariableData)[0].xObject.domObject = $("#" + indexForVariableData)[0]
        }
        if (root.children.length > 0) {
            for (var i = 0; i < root.children.length; i++) {
                recursiveForm(root.children[i], depth + 1)
            }
        }
    }
}

function setOnBlurListeners() {
    manifestNode = $("Manifest", document.xDoc)[0]
    $('.editable').blur(function () { updateXMLDomForElement(this) })
    $('.attributes').blur(function () { updateXMLDomForElement(this) })
}

function updateXMLDomForElement(element) {
    element.xObject.textContent = element.textContent;
    updateRelatedLocaleData(element)
    emptyDetectedVersions()
    updateXMLDataString()
    fillDetectedVersions()
}

function updateXMLDataString() {
    var xtos = new XMLSerializer()
    document.xmlData = xtos.serializeToString(document.xDoc)
}

function updateRelatedLocaleData(element) {
	if (element.textContent == ''){
		return	// do not empty all other field as it might be a mistake
	}
    loc = element.xObject.tagName
    if (localeList.indexOf(loc) != -1) {
        root = element.xObject.parentElement
        children = root.children
        relatedLocale = []
        for (var i = 0; i < relatedLocales.length; i++) {
            if (relatedLocales[i].indexOf(loc) != -1) {
                relatedLocale = relatedLocales[i]
            }
        }
        for (var i = 0; i < children.length; i++) {
            if (relatedLocale.indexOf(children[i].tagName) != -1) {
                children[i].textContent = element.textContent
                children[i].domObject.textContent = element.textContent
            }
        }
    }
}
//_______________________________________________ Form View Related Code_______________________________________//
var formToggle = 0
function toggleForms() {
    if (!document.xDoc) {
        return
    }
    if (formToggle == 0) {
        $('#viewFormCB')[0].innerText = "View Title & Description"
        $("#title-description")[0].style.display = "none"
        $("#otherDataForm")[0].style.display = "table"
        formToggle = 1
    } else {
        $('#viewFormCB')[0].innerText = "View Extra Data"
        $("#title-description")[0].style.display = "table"
        $("#otherDataForm")[0].style.display = "none"
        formToggle = 0
    }
}

//______________________________________________Version replacement related code__________________________________//
function detectVersion(xmlData) {
    if (!xmlData) {
        xmlData = document.xmlData
    }
    versions = xmlData.match(/[0-9]+(\.[0-9]+)+/g)
    uniqueVersions = []
    for (var i = 0; i < versions.length; i++) {
        if (uniqueVersions.indexOf(versions[i]) == -1) {
            uniqueVersions.push(versions[i])
        }
    }
    return uniqueVersions
}

function handleReplaceVersionAnchorClick() {
    if ($("#replaceVersionForm")[0].style.display == "inline") {
        return
    }
    emptyDetectedVersions()
    fillDetectedVersions()
    showReplaceVersionForm()
}

function fillDetectedVersions() {
    versions = detectVersion(document.xmlData)
    for (var i = 0; i < versions.length; i++) {
        op = document.createElement("option")
        op.value = versions[i]
        op.textContent = versions[i]
        $("#detectedVersions")[0].appendChild(op)
    }
    
}

function emptyDetectedVersions() {
    $("#detectedVersions").empty()
}

function showReplaceVersionForm() {
    $("#replaceVersionForm")[0].style.display = "inline"
}

function handleSelectionOnDetectedVersionsList(evt) {
    $("#replaceVersionTextBox")[0].value = evt.target.value
}

function handleReplaceButtonClick() {
    replaceVersion($("#detectedVersions")[0].value, $("#replaceVersionTextBox")[0].value)
}

function replaceVersion(pattern, replacement) {
    if (pattern == replacement) {
        return
    }
    var xtos = new XMLSerializer()
    document.xmlData = xtos.serializeToString(document.xDoc)
    // var pattern = '[0-9]+(\.[0-9]+)+' pattern for version number
    while (document.xmlData.indexOf(pattern) != -1)
        document.xmlData = document.xmlData.replace(document.xmlData.match(pattern), replacement)
    parseXML()
    showForm()
}
//Title and Decription Reset Functionality: reset means empting the editable fields for all locales except english
//Empty the XML Dom and then refill the Title and Description forms.
function handleTitleAndDescriptionReset(){
    emptyTitlesFromXMLDom()
    emptyDescriptionFromXMLDom()
    $("#displayNameForm tbody").empty()
    $("#descriptionForm tbody").empty()
    fillDisplayNameForm()
    fillDescriptionForm()
	setOnBlurListeners()
}

function emptyTitlesFromXMLDom(){
    displayName = $("DisplayName", document.xDoc)[0]
    children = displayName.children
    for (i = 0; i < children.length; i++) {
        if(children[i].tagName != "en_US"){
            children[i].textContent = ""
        }
    }
}

function emptyDescriptionFromXMLDom(){
    displayName = $("Description", document.xDoc)[0]
    children = displayName.children
    for (i = 0; i < children.length; i++) {
        if(children[i].tagName != "en_US"){
            children[i].textContent = ""
        }
    }
}

//_____________________________________________Save File________________________________________________________//
function createBlobFromXMLDom(xmlDom){
    if (! xmlDom){
        xmlDom = document.xDoc
    }
    xtoS = new XMLSerializer()
    return new Blob([xtoS.serializeToString(xmlDom)], { 'type': 'application\/octet-stream' })
}

function onDownload() {
    var blob = createBlobFromXMLDom()
    if ($("#lastAnchor").length == 0){
        var a = document.createElement("a")
        a.if
        a.download = "Manifest.xml"
        $("body").append(a)
        $("a:last").attr("id", "lastAnchor")
    }
    var a = $("#lastAnchor")[0]   //this is the download link created by JS in the if block
    a.href = window.URL.createObjectURL(blob)
    a.click()
}

function onUpload(){
    var XHR = new XMLHttpRequest()
    var file = createBlobFromXMLDom()
    var form = new FormData()
    form.append("blob", blob, "Manifest.xml")
    /* to do */
    // add code to select product and version from the product version selection form
    form.append("product", "Dummy product")
    form.append("version", "1.0")
    XHR.open("POST", "/upload", true)
    XHR.send()
}

function loadFromServer(){
    // get XML from Server in XML String
    setXMLData(xData)
    parseXML()
    showForm()
}