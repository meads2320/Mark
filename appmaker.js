
var fillerLink = 'Example Link';
var editHTML = "";
var gadgetId = "";
var appID = "";
var USER_PAGES = [];
var gadgetName = "";
var disableLink;
var editFake = 'Enter App Title';
var date = new Date();
var formatDate;
var saveindex = 0;
var html_plus_css;

function openWindow(url) {

    return false;
}


function cacheUserPages(data, messages, success) {
    if (success) {
        $.each(data, function () {
            if (!this.IsWelcomePage) USER_PAGES.unshift(this);
        });
    }
}

function SearchAndApply(obj, key, value, fun) {

    if (obj.hasOwnProperty(key) && obj[key] == value) fun.call(obj);
    for (all in obj) {
        if (typeof obj[all] == "object" && obj[all] != null) SearchAndApply(obj[all], key, value, fun);
    }
}


function addGadgetToPage() {

   

    gadgetName = $("#app" + appID).text();
   

    var mypages = '';
    mypages += '<h4>Add <b>"' + gadgetName + '"</b> to your page</h4>';

    if (USER_PAGES && USER_PAGES.length > 0) {
        mypages += '<p>Select an existing page:</p>';
        mypages += '<select id="pageToInstallTo">';
        $.each(USER_PAGES, function () {
            mypages += '<option value="' + this.PageID + '">' + this.Title + '</option>';
        });
        mypages += '</select>';
    }
    mypages += '<p>Create a new page:</p>';
    mypages += '<input type="text" placeholder="New Page Name" />';

    colorAlertOkCancel(mypages, function () {
        bdigital.service.GadgetService.InstallGadget(appID, $("#pageToInstallTo").val(), showExtJSResult);
        //bdigital.service.PageService.GoToTab(this.Position);
        SearchAndApply(USER_PAGES, 'PageID', $("#pageToInstallTo").val(), function () {
            bdigital.service.PageService.GoToTab(this.Position + 1);
        });

    });
}

function removeGadgetFromPage() {
    var mypages = '';
    mypages += '<h4>Remove <b>' + CURRENT_DETAIL_ITEM.GName + '</b> from your pages?</h4>';

    colorAlertOkCancel(mypages, function () {
        //bdigital.service.GadgetService.UninstalGadget(CURRENT_DETAIL_ITEM.GId, showExtJSResult);
    });
}

//To use ColorAlerts, make sure to include the below scripts:


function colorAlertOkCancel(message, handler) {

    var myOkCancel = '';
    myOkCancel += '<div class="colorAlertWrapper">';
    myOkCancel += message;
    myOkCancel += '<div class="footer">';
    myOkCancel += '<a class="buttonadd" onclick="CloseMe()">Okay</a>';
    myOkCancel += '<a class="buttonadd" onclick="colorAlertCloseHandler()">Cancel</a>';
    myOkCancel += '</div>';
    myOkCancel += '</div>';
    CloseMe = function () {
        handler();
        colorAlertCloseHandler();
    };
    $.colorbox({ html: myOkCancel, fixed: true, width: "300px", height: "300px", opacity: "0.8", scrolling: false });
}

function colorAlert(message) {

    var myalert = '';           
    myalert += '<div class="colorAlertWrapper">';
    myalert += message;
    myalert += '<div class="footer">';
    myalert += '<a class="button" onclick="colorAlertCloseHandler()">Okay</a>';
    myalert += '</div>';
    myalert += '</div>';

    $.colorbox({ html: myalert, fixed: true, width: "300px", height: "274px", opacity: "0.8", scrolling: false });
}

var colorAlertCloseHandler = $.colorbox.close;

//Default callback
function showExtJSResult(data, messages, success) {
    //alert(JSON.stringify(messages + success));
}



 function Validate()
                {
                    $("#preview").empty();
                    var xmlString = $("#xml").val();
                    $.post("/Gadgets/ValidateManifestAndGetInformation/", { "xmlGadget": xmlString }, function output(data)
                    {
                        $("#preview").showJson(data);

                       
                       

                        var xml = parseXml(xmlString);
                        var obj = xml2json(xml, "   ");
                        $("#json").text(obj);
                        
                        obj = JSON.parse(obj);
                        var html = obj.Module.Content["#cdata"] || obj.Module.Content[0]["#cdata"];
                        
                       
                    });
                }


   function verifyForUpload()
            {
                $("#preview").empty();
                var xml = $("#xml").val();
                if(!xml)
                {
                    alert("No XML");
                    return;
                }

                $.ajax(
		        {
		            type: 'POST',
		            url: "/Gadgets/ValidateManifestAndGetInformation/",
		            data: { "xmlGadget": xml },
		            success: function (data) {



		                //$("#preview").showJson(data);
		                uploadGadget(xml, data.data);
		            }
		        });
            }
    
            function uploadGadget(xml, params) 
            {
                var postData = {
                    xmlGadget: xml,
                    ownApp: false,
                    nameOfGadget: params.Title,
                    authorName: params.Author,
                    authorEmail: params.AuthorEmail,
                    authorOrganization: params.AuthorOrganization,
                    desription: params.Description,
                    thumbnail: params.Thumbnail,
                    title: params.Title,
                    adminOnly: params.AdminOnly,
                    gadgetID: gadgetId,
                    width:  params.Width,
                    allowSharingByAll: params.allowSharingByAll,
                    height: params.Height,
                    autoHeight: params.autoHeight,
                    categoryID:  params.categoryID
                   
                };
                
                $.ajax(
		        {
                    type: 'POST',
                    url: "/Gadgets/UploadGadget/",
                    data: postData,
			        success: function (data)
			        {
				      $("#preview").showJson(JSON.parse(data));
				      $("#preview").html(data);
				       location.reload();
				   }
                  
		        });
}

function verifyForUploadSecond() {
    $("#preview").empty();
    var xml = $("#xml").val();
    if (!xml) {
        alert("No XML");
        return;
    }

    $.ajax(
		        {
		            type: 'POST',
		            url: "/Gadgets/ValidateManifestAndGetInformation/",
		            data: { "xmlGadget": xml },
		            success: function (data) {



		                //$("#preview").showJson(data);
		                uploadGadgetSecond(xml, data.data);
		            }
		        });
}

function uploadGadgetSecond(xml, params) {
    var postData = {
        xmlGadget: xml,
        ownApp: false,
        nameOfGadget: params.Title,
        authorName: params.Author,
        authorEmail: params.AuthorEmail,
        authorOrganization: params.AuthorOrganization,
        desription: params.Description,
        thumbnail: params.Thumbnail,
        title: params.Title,
        adminOnly: params.AdminOnly,
        gadgetID : appID,
        width: params.Width,
        allowSharingByAll: params.allowSharingByAll,
        height: params.Height,
        autoHeight: params.autoHeight,
        categoryID: params.categoryID

    };

    $.ajax(
		        {
		            type: 'POST',
		            url: "/Gadgets/UploadGadget/",
		            data: postData,
		            success: function (data) {
		                alert("second save");


		            }

		        });
}




function verifyForUploadSave() {
    $("#preview").empty();
    var xml = $("#xml").val();
    if (!xml) {
        alert("No XML");
        return;
    }

    $.ajax(
		        {
		            type: 'POST',
		            url: "/Gadgets/ValidateManifestAndGetInformation/",
		            data: { "xmlGadget": xml },
		            success: function (data) {



		               

		                //$("#preview").showJson(data);
		                uploadGadgetSave(xml, data.data);
		            }
		        });
}

function uploadGadgetSave(xml, params) {
    var postData = {
        xmlGadget: xml,
        ownApp: false,
        nameOfGadget: params.Title,
        authorName: params.Author,
        authorEmail: params.AuthorEmail,
        authorOrganization: params.AuthorOrganization,
        desription: params.Description,
        thumbnail: params.Thumbnail,
        title: params.Title,
        adminOnly: params.AdminOnly,
        gadgetID: gadgetId,
        width: params.Width,
        allowSharingByAll: params.allowSharingByAll,
        height: params.Height,
        autoHeight: params.autoHeight,
        categoryID: params.categoryID

    };



    $.ajax(
		        {
		            type: 'POST',
		            url: "/Gadgets/UploadGadget/",
		            data: postData,
		            success: function (data) {

		                // alert(postData);

		                //alert(data);

		                var dataString = data.toString();

		                var newString = dataString.search("gadgetID");   //  "gadgetid" : 

		                var fromTo = newString + 9;

		                var IDString = dataString.substring(fromTo, fromTo + 15).match(/[0-9]{4,}/);

		                // alert(IDString);

		                appID = IDString.toString();
		              

		                $("#save-state").append("<p id=save-time>Last saved on: " + date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p>");

		            }
		        });


}





 function createNewApp() 
            {
              
                
                var gadget = new Module();
                gadget.require('views', 'dynamic-height', 'setprefs');
                gadget.enableLinkToCanvas();

               
            
                //Append scripts to my gadget
                var MyScripts = new GadgetScripts();

                function init() {

                    gadgets.window.adjustHeight();
                }

                MyScripts.addScript(init);
                MyScripts.addScript("gadgets.util.registerOnLoadHandler(init);");
                
                gadget.appendHomeViewHtml(MyScripts.getScripts());




               var cssJS = '<link href="https://code.benefithub.com/me/Styles/main.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.js"></script><link href="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/Scripts/canvasv.js"></script>';
                
               

                 html_box = $(".boxrow").html();

                html_plus_css = cssJS + html_box;
               

            

                gadget.setHomeViewHtml(html_plus_css);

               var title= $(".editfake").text();

              gadget.setTitle(title);


               var description= $("#description").val();

              gadget.setDescription(description);

               var thumbnail = $("#thumbnail").val();

                 gadget.setThumbnail(thumbnail);

                //Load JSON into text field
                 $("#json").text(JSON.stringify(gadget.getObj()));


               
                
            }


            function verifyForUploadEdit() {
                $("#preview").empty();
                var xml = $("#xml").val();
                if (!xml) {
                    alert("No XML");
                    return;
                }

                $.ajax(
		        {
		            type: 'POST',
		            url: "/Gadgets/ValidateManifestAndGetInformation/",
		            data: { "xmlGadget": xml },
		            success: function (data) {




		                //$("#preview").showJson(data);
		                uploadGadgetEdit(xml, data.data);
		            }
		        });
            }

            function uploadGadgetEdit(xml, params) {
                var postData = {
                    xmlGadget: xml,
                    ownApp: false,
                    nameOfGadget: params.Title,
                    authorName: params.Author,
                    authorEmail: params.AuthorEmail,
                    authorOrganization: params.AuthorOrganization,
                    desription: params.Description,
                    thumbnail: params.Thumbnail,
                    title: params.Title,
                    adminOnly: params.AdminOnly,
                    gadgetID: appID,
                    width: params.Width,
                    allowSharingByAll: params.allowSharingByAll,
                    height: params.Height,
                    autoHeight: params.autoHeight,
                    categoryID: params.categoryID

                };

                $.ajax(
		        {
		            type: 'POST',
		            url: "/Gadgets/UploadGadget/",
		            data: postData,
		            success: function (data) {
		                $("#preview").showJson(JSON.parse(data));
		                $("#preview").html(data);
		                location.reload();
		            }
		        });
		    }

		


            function openwindow(url) {
                 
                    return false;
                }
//                else {


//                    var prefs = new gadgets.Prefs();
//                    prefs.set("seurl", url);
//                    //alert(prefs.getString("appurl"));
//                    gadgets.views.requestNavigateTo('canvas');
//                }
//            }

             



            //my apps list


            function openApp(gadgetId) {
              

               
               
                 var prefs = new gadgets.Prefs();
                prefs.set("gadgetid", gadgetId);

                $.post("/Gadgets/GetGadgetInformation/", { "gadgetID": gadgetId }, function output(data) {
                    $("#xml").text(data.data.Manifest);

                    $("#preview").empty();
                    var xmlString = $("#xml").val();
                    $.post("/Gadgets/ValidateManifestAndGetInformation/", { "xmlGadget": xmlString }, function output(data) {
                        $("#preview").showJson(data);

                        var xml = parseXml(xmlString);
                        var obj = xml2json(xml, "   ");
                        $("#json").text(obj);

                        obj = JSON.parse(obj);
                        var html = obj.Module.Content["#cdata"] || obj.Module.Content[0]["#cdata"];

                        var StrippedString = html.replace('<link href="https://code.benefithub.com/me/Styles/main.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.js"></script><link href="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/Scripts/canvasv.js"></script>', "");


                        $("#previewbox").children().remove();
                        $("#previewbox").show();
                        $("#previewbox").html(StrippedString);

                      

                        editHTML = StrippedString;

                       
                    });

                });


            
               
                appID = gadgetId;




            }

            function init() {

               
               
                $.holdReady(true);

                

                var opts = {
                    lines: 13, // The number of lines to draw
                    length: 7, // The length of each line
                    width: 4, // The line thickness
                    radius: 10, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    color: '#000', // #rgb or #rrggbb
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: 'auto', // Top position relative to parent in px
                    left: 'auto' // Left position relative to parent in px
                };
                var target = document.getElementById('spin');
                var spinner = new Spinner(opts).spin(target);
             
              

                    
                var postdata = {
                    "appInstancesOnly": "true",
                    "page": "1",
                    "start": "0",
                    "limit": "25"
                };

                $.post("/Gadgets/GetInstalledGadgetsForUser/", postdata, function output(data) {

          

                    //$("#apptable").showJson(data.data);
                    $.each(data.data, function () {



                        if (this.gadgetID > 6900) {




                            if (this.isApps) {
                                var app = '';
                                app += '<tr class="row">';
                                app += '<th><img id=img' + this.gadgetID + ' src="' + this.img + '" /></th>';

                                app += '<th><a id=app' + this.gadgetID + ' class="apptitle" href="#" onclick="openApp(' + this.gadgetID + ')">' + this.gadgetName + '</a></th>';

                                app += '</tr>';
                                $("#apptable").append(app);

                               
                            }
                        } //end gadgetId check
                    });

                    $.holdReady(false);
                    spinner.stop();
                    $("#spin").hide();
                    $("#container").css("visibility", "visible");

                  

                });
            }
		    gadgets.util.registerOnLoadHandler(init);





  
       //popup.js

		    $(function () {




		        var editMode = false;
		        var ulistindex = 0;
		        var olistindex = 0;
		        var uli = 0;
		        var oli = 0;

		        // Area Form 


		        $("#dialog-form-area").dialog({
		            autoOpen: false,
		            height: 420,
		            width: 440,
		            modal: true,
		            buttons: {
		                "Save": function () {


		                    $(".box").css("background", $("#bgcolor_area").val() + " " + "url(" + $("#bgimageurl_area").val() + ")");
		                    // tile 
		                    //$(".box").css("background-repeat", "repeat");
		                    $(".box").css("background-size", "100% 100%");



		                    //removes selected object
		                    $(".exit").click(function () {
		                        $(this).parent().remove();
		                    });

		                    $(this).dialog("close");

		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }
		            }
		        });


		        // Header Form 

		        $("#dialog-form-header").dialog({
		            autoOpen: false,
		            height: 440,
		            width: 300,
		            modal: true,
		            buttons: {
		                "Save": function () {

		                    if (loadMode == true) {

		                        if ($("#header_boldtext").attr("checked")) {
		                            loadElement.css("font-weight", "bold");
		                        }
		                        else {
		                            loadElement.css("font-weight", "normal");
		                        }


		                        if ($("#header_italictext").attr("checked")) {
		                            loadElement.css("font-style", "italic");
		                        }
		                        else {
		                            loadElement.css("font-style", "normal");
		                        }


		                        loadElement.css("color", $("#textcolor_header").val());
		                        loadElement.css("font-size", $("#size_header").val());
		                        loadMode = false;

		                    }


		                    else {

		                        if ($("#header_boldtext").attr("checked")) {
		                            selectedElement.css("font-weight", "bold");
		                        }
		                        else {
		                            selectedElement.css("font-weight", "normal");
		                        }

		                        if ($("#header_italictext").attr("checked")) {
		                            selectedElement.css("font-style", "italic");
		                        }
		                        else {
		                            selectedElement.css("font-style", "normal");
		                        }


		                        selectedElement.css("color", $("#textcolor_header").val());
		                        selectedElement.css("font-size", $("#size_header").val());



		                    }

		                    $(this).dialog("close");

		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }


		            }



		        });


		        //Text Form 

		        $("#dialog-form-text").dialog({
		            autoOpen: false,
		            height: 460,
		            width: 300,
		            modal: true,
		            buttons: {
		                "Save": function () {

		                    if (loadMode == true) {



		                        loadElement.css("font-family", $("#font_familytext option:selected").val());
		                        loadElement.css("font-size", $("#text_size").val());
		                        loadElement.css("color", $("#text_color").val());
		                        if ($("#text_boldtext").attr("checked")) {
		                            loadElement.css("font-weight", "bold");
		                        }
		                        else {
		                            loadElement.css("font-weight", "normal");
		                        }


		                        if ($("#text_italictext").attr("checked")) {
		                            loadElement.css("font-style", "italic");
		                        }
		                        else {
		                            loadElement.css("font-style", "normal");
		                        }

		                        loadMode = false;

		                    }


		                    else {


		                        selectedElement.css("font-family", $("#font_familytext option:selected").val());
		                        selectedElement.css("font-size", $("#text_size").val());
		                        selectedElement.css("color", $("#text_color").val());
		                        if ($("#text_boldtext").attr("checked")) {
		                            selectedElement.css("font-weight", "bold");
		                        }
		                        else {
		                            selectedElement.css("font-weight", "normal");
		                        }


		                        if ($("#text_italictext").attr("checked")) {
		                            selectedElement.css("font-style", "italic");
		                        }
		                        else {
		                            selectedElement.css("font-style", "normal");
		                        }

		                    }

		                    $(this).dialog("close");
		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }
		            }
		        });

		        //Image Form 

		        $("#dialog-form-image").dialog({
		            autoOpen: false,
		            height: 500,
		            width: 320,
		            modal: true,
		            buttons: {
		                "Save": function () {
		                    if (loadMode == true) {
		                        loadElement.css("border", ($("#borderpixels_image").val() + " solid " + $("#bordercolor_image").val()));
		                        loadElement.attr('src', $("#url_image").val());
		                        loadElement.attr("alt", $("#alt_image").val());
		                        loadElement.attr("onclick", "openWindow(\'" + $("#img_URL").val() + "\')");

		                        loadMode = false;
		                    }


		                    else {

		                        selectedElement.css("border", ($("#borderpixels_image").val() + " solid " + $("#bordercolor_image").val()));
		                        selectedElement.attr('src', $("#url_image").val());
		                        selectedElement.attr("alt", $("#alt_image").val());
		                        selectedElement.attr("onclick", "openWindow(\'" + $("#img_URL").val() + "\')");

		                    }
		                    $(this).dialog("close");
		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }
		            }
		        });

		        //Link Form 

		        $("#dialog-form-link").dialog({
		            autoOpen: false,
		            height: 440,
		            width: 280,
		            modal: true,
		            buttons: {
		                "Save": function () {
		                    if (loadMode == true) {


		                        loadLinkEdit.css("color", $("#link_color").val());
		                        loadLinkEdit.css("font-size", $("#link_size").val());
		                        loadLinkEdit.css("text-decoration", $("#link_decoration option:selected").text());
		                        loadLinkEdit.attr("onclick", "openWindow(\'" + $("#link_URL").val() + "\')");
		                        loadLinkEdit.text($("#link_description").val());

		                    }

		                    else {


		                        linkEdit.css("color", $("#link_color").val());
		                        linkEdit.css("font-size", $("#link_size").val());
		                        linkEdit.css("text-decoration", $("#link_decoration option:selected").text());
		                        linkEdit.attr("onclick", "openWindow(\'" + $("#link_URL").val() + "\')");
		                        linkEdit.text($("#link_description").val());


		                    }




		                    $(".link").mouseover(function () {
		                        $(".exitlink").show();
		                    });
		                    $(".link").mousedown(function () {
		                        $(".exitlink").show();
		                    });
		                    $(".link").mouseleave(function () {
		                        $(".exitlink").hide();
		                    });

		                    $(".exitlink").click(function () {

		                        $(this).parent().remove();
		                    });


		                    $(this).dialog("close");

		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }
		            }
		        });

		        //Button Form 

		        $("#dialog-form-button").dialog({
		            autoOpen: false,
		            height: 640,
		            width: 400,
		            modal: true,
		            buttons: {
		                "Save": function () {
		                    if (loadMode == true) {



		                        childLoadElement.text($("#buttonlink_description").val());
		                        childLoadElement.css("font-size", $("#textfontsize_button").val());
		                        childLoadElement.css("color", $("#textcolor_button").val());
		                        divLoadElement.css("border", ($("#borderpixels_button").val() + " solid " + $("#bordercolor_button").val()));
		                        divLoadElement.css("background-color", $("#bgcolor_button").val());
		                        loadElement.attr("onclick", "openWindow(\'" + $("#button_URL").val() + "\')");

		                        loadMode = false;
		                    }


		                    else {


		                        childElement.text($("#buttonlink_description").val());
		                        childElement.css("font-size", $("#textfontsize_button").val());
		                        childElement.css("color", $("#textcolor_button").val());
		                        divElement.css("border", ($("#borderpixels_button").val() + " solid " + $("#bordercolor_button").val()));

		                        selectedElement.attr("onclick", "openWindow(\'" + $("#button_URL").val() + "\')");
		                        divElement.css("background-color", $("#bgcolor_button").val());
		                    }

		                    $(this).dialog("close");

		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }
		            }


		        });

		        $("#dialog-form-file").dialog({
		            autoOpen: false,
		            height: 440,
		            width: 280,
		            modal: true,
		            buttons: {
		                "Save": function () {
		                    if (loadMode == true) {

		                        loadElement.css("color", $("#file_color").val());
		                        loadElement.css("font-size", $("#file_size").val());
		                        loadElement.css("text-decoration", $("#file_decoration option:selected").text());



		                        loadMode = false;
		                    }

		                    else {


		                        selectedElement.css("color", $("#file_color").val());
		                        selectedElement.css("font-size", $("#file_size").val());
		                        selectedElement.css("text-decoration", $("#file_decoration option:selected").text());


		                    }
		                    $(this).dialog("close");

		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }
		            }
		        });













		        $("#dialog-form-options").dialog({
		            autoOpen: false,
		            height: 300,
		            width: 400,
		            modal: true,
		            buttons: {

		                "Add New": function () {



		                    disableLink = false;

		                    $(".exitheader").hide();
		                    $(".exittext").hide();
		                    $(".exitimage").hide();
		                    $(".exitolist").hide();
		                    $(".exitulist").hide();
		                    $(".exitbutton").hide();
		                    $(".exitfile").hide();
		                    $(".exitlink").hide();

		                    $(".box * ").removeAttr("id").resizable("destroy").draggable("destroy");

//		                    $(".box").resizable("destroy").draggable("destroy");
//		                    $(".olist").removeAttr("id").resizable("destroy").draggable("destroy");
//		                    $(".ulist").removeAttr("id").resizable("destroy").draggable("destroy");
//		                    $(".buttontext").removeAttr("id").draggable("destroy");
//		                    $(".buttonlink").removeAttr("id").draggable("destroy");
//		                    $(".text").removeAttr("id").resizable("destroy").draggable("destroy");
//		                    $(".image-clone").removeAttr("id").resizable("destroy").draggable("destroy");
//		                    $(".img-clone").removeAttr("id").resizable("destroy").draggable("destroy");
//		                    $(".button").removeAttr("id").resizable("destroy").draggable("destroy");
//		                    $(".header").removeAttr("id").resizable("destroy").draggable("destroy");
//		                    $(".link").removeAttr("id").draggable("destroy");
//		                    $(".linktext").removeAttr("id").draggable("destroy");
//		                    $(".editheader").removeAttr("id").draggable("destroy");
//		                    $(".edittext").removeAttr("id").draggable("destroy");
//		                    $(".editlist").removeAttr("id").draggable("destroy");
//		                    $("ul").removeAttr("id").draggable("destroy");
//		                    $("ol").removeAttr("id").draggable("destroy");
//		                    $("li").removeAttr("id").draggable("destroy");

//		                    $(".file ext_xls").removeAttr("id").draggable("destroy");
//		                    $(".file ext_pdf").removeAttr("id").draggable("destroy");
//		                    $(".file ext_txt").removeAttr("id").draggable("destroy");
//		                    $(".file ext_ppt").removeAttr("id").draggable("destroy");
//		                    $(".file ext_doc").removeAttr("id").draggable("destroy");
//		                    $(".file ext_docx").removeAttr("id").draggable("destroy");




		                    $(".box").css("width", "");
		                    $(".box").css("margin-top", "");
		                    $(".box").css("margin-left", "");



		                    createNewApp();



		                    var obj = $("#json").val();


		                    var xmlNode = json2xml(JSON.parse(obj));
		                    $("#xml").text(xmlNode);



		                    verifyForUpload();



		                    //  location.reload();

		                    //		                         $(".load-container").show();
		                    //		                        $("#mini-layout-container").hide();



		                    $(this).dialog("close");
		                },
		                "Close": function () {
		                    $(this).dialog("close");
		                }
		            }
		        });

		        $("#dialog-form-update").dialog({
		            autoOpen: false,
		            height: 300,
		            width: 400,
		            modal: true,
		            buttons: {
		                "Update": function () {

		                    disableLink = false;


		                    $(".exitheader").hide();
		                    $(".exittext").hide();
		                    $(".exitimage").hide();
		                    $(".exitolist").hide();
		                    $(".exitulist").hide();
		                    $(".exitbutton").hide();
		                    $(".exitfile").hide();
		                    $(".exitlink").hide();

		                    $(".box * ").removeAttr("id").resizable("destroy").draggable("destroy");

//		                    $(".box").resizable("destroy");
//		                    $(".olist").removeAttr("id").resizable("destroy");
//		                    $(".ulist").removeAttr("id").resizable("destroy");
//		                    $(".buttontext").removeAttr("id");
//		                    $(".buttonlink").removeAttr("id");
//		                    $(".text").removeAttr("id").resizable("destroy");
//		                    $(".image-clone").removeAttr("id").resizable("destroy");
//		                    $(".img-clone").removeAttr("id").resizable("destroy");
//		                    $(".button").removeAttr("id").resizable("destroy");
//		                    $(".header").removeAttr("id").resizable("destroy");
//		                    $(".link").removeAttr("id");
//		                    $(".linktext").removeAttr("id");
//		                    $(".editheader").removeAttr("id");
//		                    $(".edittext").removeAttr("id");
//		                    $(".editlist").removeAttr("id");
//		                    $("ul").removeAttr("id");
//		                    $("ol").removeAttr("id");
//		                    $("li").removeAttr("id");

//		                    $(".file ext_xls").removeAttr("id");
//		                    $(".file ext_pdf").removeAttr("id");
//		                    $(".file ext_txt").removeAttr("id");
//		                    $(".file ext_ppt").removeAttr("id");
//		                    $(".file ext_doc").removeAttr("id");
//		                    $(".file ext_docx").removeAttr("id");



		                    // not for update
		                    // only new app

		                    //  createNewApp();




		                    var gadget = new Module();
		                    gadget.require('views', 'dynamic-height', 'setprefs');
		                    gadget.enableLinkToCanvas();


		                    var cssJS = '<link href="https://code.benefithub.com/me/Styles/main.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.js"></script><link href="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/Scripts/canvasv.js"></script>';



		                    html_box = $(".boxrow").html();

		                    var html_plus_css = cssJS + html_box;




		                    gadget.setHomeViewHtml(html_plus_css);

		                    var title = $(".editfake").text();

		                    gadget.setTitle(title);


		                    var description = $("#updescription").val();

		                    gadget.setDescription(description);

		                    var thumbnail = $("#upthumbnail").val();

		                    gadget.setThumbnail(thumbnail);

		                    //Load JSON into text field
		                    $("#json").text(JSON.stringify(gadget.getObj()));




		                    var obj = $("#json").val();


		                    var xmlNode = json2xml(JSON.parse(obj));
		                    $("#xml").text(xmlNode);



		                    verifyForUploadEdit();


		                    //                $(".load-container").show();
		                    //                $("#mini-layout-container").hide();

		                    $(this).dialog("close");


		                },
		                "Close": function () {
		                    $(this).dialog("close");
		                }
		            }
		        });

		        $("#dialog-form-remove").dialog({
		            autoOpen: false,
		            height: 100,
		            width: 400,
		            modal: true,
		            buttons: {
		                "Delete": function () {



		                    $.ajax(
		                    {
		                        type: 'POST',
		                        url: "/Gadgets/DeleteGadget",
		                        data: { gadgetID: appID },
		                        success: function (data) {

		                           // location.reload();
		                        }
		                    });


		                    //                $("#previewbox").children().remove();
		                    //                $("#previewbox").hide();

		                    //                $("#appId").val(0);



		                    $(this).dialog("close");


		                },
		                "Close": function () {
		                    $(this).dialog("close");
		                }
		            }
		        });


		        $("#dialog-form-list-edit").dialog({
		            autoOpen: false,
		            height: 460,
		            width: 300,
		            modal: true,
		            buttons: {
		                "Save": function () {



		                    if (loadMode == true) {


		                        loadElement.css("font-size", $("#listtextedit_size").val());
		                        loadElement.css("color", $("#listedit_color").val());

		                        if ($("#listedit_boldtext").attr("checked")) {
		                            loadElement.css("font-weight", "bold");
		                        }
		                        else {
		                            loadElement.css("font-weight", "normal");
		                        }


		                        if ($("#listedit_italictext").attr("checked")) {
		                            loadElement.css("font-style", "italic");
		                        }
		                        else {
		                            loadElement.css("font-style", "normal");
		                        }



		                        loadMode = false;

		                    }
		                    if (editMode == true) {


		                        selectedElement.css("font-size", $("#listtextedit_size").val());
		                        selectedElement.css("color", $("#listedit_color").val());

		                        if ($("#listedit_boldtext").attr("checked")) {
		                            selectedElement.css("font-weight", "bold");
		                        }
		                        else {
		                            selectedElement.css("font-weight", "normal");
		                        }


		                        if ($("#listedit_italictext").attr("checked")) {
		                            selectedElement.css("font-style", "italic");
		                        }
		                        else {
		                            selectedElement.css("font-style", "normal");
		                        }



		                    }


		                    $(this).dialog("close");
		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }
		            }
		        });


		        $("#dialog-form-add-to-page").dialog({
		            autoOpen: false,
		            height: 100,
		            width: 400,
		            modal: true,
		            buttons: {
		                "Add": function () {

		                    //                                          $.ajax(
		                    //		                        {
		                    //                                    type: 'POST',
		                    //                                    url: "/Gadgets/UploadGadget/",
		                    //                                    data: postData,
		                    //			                        success: function (data)
		                    //			                        {
		                    //				                      $("#preview").showJson(JSON.parse(data));
		                    //				                      $("#preview").html(data);
		                    //				                       location.reload();
		                    //			                        }
		                    //		                        });
		                    //                           



		                    $(this).dialog("close");


		                },
		                "Close": function () {
		                    $(this).dialog("close");
		                }
		            }
		        });





		        //List Form 

		        $("#dialog-form-list").dialog({
		            autoOpen: false,
		            height: 460,
		            width: 300,
		            modal: true,
		            buttons: {
		                "Save": function () {




		                    var listSelect = "";

		                    $("#list_type").change(function () {

		                        $("#list_type option:selected").each(function () {
		                            listSelect += $(this).text() + " ";
		                        });


		                    })
                 .trigger('change');




		                    if ($("#list_type option:selected").val() == "Unordered List") {

		                        $(".box").append("<div><ul class=ulist id=ulist" + ulistindex + " ><img class=exitulist src=https://code.benefithub.com/me/images/close.png alt=close /></ul></div>");




		                        for (var ulistNum = 0; ulistNum < $("#list_size").val(); ulistNum++) {

		                            $("#ulist" + ulistindex).append("<div><li><span class=editlist id =uli" + uli + " >Edit List Item</span></li><img class=exitulist src=https://code.benefithub.com/me/images/close.png alt=close /></div>");

		                            $(function () {
		                                $("#uli" + uli).editable({ onEdit: begin });
		                                function begin() { }
		                            });

		                            uli++;


		                        }

		                        $("#ulist" + ulistindex).css("font-size", $("#listtext_size").val());
		                        $("#ulist" + ulistindex).css("color", $("#list_color").val());

		                        if ($("#list_boldtext").attr("checked")) {
		                            $("#ulist" + olistindex).css("font-weight", "bold");
		                        }
		                        else {
		                            $("#ulist" + olistindex).css("font-weight", "normal");
		                        }


		                        if ($("#list_italictext").attr("checked")) {
		                            $("#ulist" + olistindex).css("font-style", "italic");
		                        }
		                        else {
		                            $("#ulist" + olistindex).css("font-style", "normal");
		                        }



		                    }
		                    else if ($("#list_type option:selected").val() == "Ordered List") {

		                        $(".box").append("<div><ol class=olist id=olist" + olistindex + " ><img class=exitolist src=https://code.benefithub.com/me/images/close.png alt=close /></ol></div>");



		                        for (var olistNum = 0; olistNum < $("#list_size").val(); olistNum++) {

		                            $("#olist" + olistindex).append("<div><li ><span class=editlist id=oli" + oli + " >Edit List Item</span></li><img class=exitolist src=https://code.benefithub.com/me/images/close.png alt=close /></div>");


		                            $(function () {
		                                $("#oli" + oli).editable({ onEdit: begin });
		                                function begin() { }
		                            });

		                            oli++;

		                        }

		                        $("#olist" + olistindex).css("font-size", $("#listtext_size").val());
		                        $("#olist" + olistindex).css("color", $("#list_color").val());

		                        if ($("#list_boldtext").attr("checked")) {
		                            $("#olist" + olistindex).css("font-weight", "bold");
		                        }
		                        else {
		                            $("#olist" + olistindex).css("font-weight", "normal");
		                        }


		                        if ($("#list_italictext").attr("checked")) {
		                            $("#olist" + olistindex).css("font-style", "italic");
		                        }
		                        else {
		                            $("#olist" + olistindex).css("font-style", "normal");
		                        }



		                    }

		                    $(function () {
		                        $(".ulist").resizable({
		                            containment: "parent"
		                        });
		                    });

		                    $(function () {
		                        $(".olist").resizable({
		                            containment: "parent"
		                        });
		                    });





		                    $(".ulist").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });
		                    $(".olist").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		                    $(".exitulist").hide();

		                    $(".ulist").mouseover(function () {
		                        $(".exitulist").show();
		                    });
		                    $(".ulist").mousedown(function () {
		                        $(".exitulist").show();
		                    });
		                    $(".ulist").mouseleave(function () {
		                        $(".exitulist").hide();
		                    });

		                    $(".exitolist").hide();

		                    $(".olist").mouseover(function () {
		                        $(".exitolist").show();
		                    });
		                    $(".olist").mousedown(function () {
		                        $(".exitolist").show();
		                    });
		                    $(".olist").mouseleave(function () {
		                        $(".exitolist").hide();
		                    });




		                    //removes selected object
		                    $(".exitulist").click(function () {
		                        $(this).parent().remove();
		                    });

		                    //removes selected object
		                    $(".exitolist").click(function () {
		                        $(this).parent().remove();
		                    });



		                    $(".ulist").bind("contextmenu", function (e) {
		                        // check if right button is clicked
		                        selectedElement = $(this);

		                        editMode = true;
		                        $("#dialog-form-list-edit").dialog("open");
		                        return false;
		                    });


		                    $(".olist").bind("contextmenu", function (e) {
		                        // check if right button is clicked
		                        selectedElement = $(this);

		                        editMode = true;
		                        $("#dialog-form-list-edit").dialog("open");
		                        return false;
		                    });



		                    ulistindex++;
		                    olistindex++;




		                    $(this).dialog("close");
		                },
		                Cancel: function () {
		                    $(this).dialog("close");
		                }
		            }
		        });



		        $("#dialog-form-back-add").dialog({
		            autoOpen: false,
		            height: 100,
		            width: 400,
		            modal: true,
		            buttons: {
		                "Exit And Save": function () {

		                    $("#title").val($(".editfake").text());
		                    $("#description").val("Enter Description");
		                    $("#thumbnail").val("https://code.benefithub.com/me/images/pictures.png");


		                    $("#dialog-form-options").dialog("open");

		                    $(this).dialog("close");

		                },
		                "Exit Without Save": function () {

		                    location.reload();
		                    $(this).dialog("close");
		                }
		            }
		        });


		        $("#dialog-form-back-update").dialog({
		            autoOpen: false,
		            height: 100,
		            width: 400,
		            modal: true,
		            buttons: {
		                "Exit And Save": function () {


		                 

		                    $("#dialog-form-update").dialog("open");


		                    $(this).dialog("close");

		                },
		                "Exit Without Save": function () {

		                    location.reload();
		                    $(this).dialog("close");
		                }
		            }
		        });








		    });


  
          
		


        
        // When page fully loads...
		    $(document).ready(function () {

		        bdigital.service.PageService.LoadPages(cacheUserPages);




		        var Templates =
[
		        // Template 1
        {
        "dimensions": {
            "rows": 1,
            "cols": 1
        },
        "boxes":
            [
                {
                    "rowspan": "1",
                    "colspan": "1"
                }
            ]
    }
    ];




		        // Do these things:

		        var newApp = false;
		        var toggle = false;
		        var appNumber;

		        // index for id's of user created elements 
		        var headerindex = 0;
		        var textindex = 0;
		        var linkindex = 0;
		        var imageindex = 0;
		        var buttonindex = 0;
		        var buttontextindex = 0;
		        var fileindex = 0;



		        //Render Templates
		        $.each(Templates, function (index) {
		            RenderTemplateLayout(index, this);
		        });

		        //Add boxes and toolbar 
		        $("td").append("<div class=box></div>");
		        //    $(".box").css("width", "300px");



		        $("#mini-layout-container").append("<p id=fake-header ><span class=editfake>" + editFake + "</span></p>");

		        $("#mini-layout-container").append("<div id=save-state></div>");


		        // this will append save time 
		        //  $("#save-state").append("<p id=save-time>" + formatDate + "</p>");



		        $(function () {
		            $(".editfake").editable({ onEdit: begin });
		            function begin() { }
		        });


		        $("#container").append("<div class=image-container ></div>");
		        $(".image-container").append("<div class=image-data ></div>");

		        $("#container").append("<div class=file-container ></div>");
		        $(".file-container").append("<div class=file-data ></div>");
		        $(".file-data").append("<ul class=jqueryFileTree style=display: none;>");

		        $("#container").append("<div class=toolbar></div>");

		        $(".toolbar").append("<div class=area-button >S<span class=tooltext></span></div>");
		        $(".toolbar").append("<div class=header-button >H <span class=tooltext></span></div>");
		        $(".toolbar").append("<div class=list-button >p <span class=tooltext></span></div>");
		        $(".toolbar").append("<div class=text-button >T <span class=tooltext></span></div>");
		        $(".toolbar").append("<div class=image-button >I <span class=tooltext></span></div>");
		        $(".toolbar").append("<div class=link-button >K <span class=tooltext></span></div>");
		        $(".toolbar").append("<div class=button-button >v <span class=tooltext></span></div>");
		        $(".toolbar").append("<div class=file-button >b<span class=tooltext></span></div>");

		        //hides the toolbar until create new or load 
		        $(".toolbar").hide();

		        //hides preview box until a selection is clicked
		        //$("#previewbox").hide();



		        //   Enable miniColors
		        $(".color-picker").miniColors({
		            letterCase: 'uppercase',
		            change: function (hex, rgb) {
		                //logData(hex, rgb);
		            }
		        });

		        //load container is first container when page loads
		        //mini-layout container is work area for apps
		        $(".load-container").show();
		        $("#mini-layout-container").hide();

		        $(".image-container").hide();
		        $(".file-container").hide();
		        //image container 

		        $(".image-button, .img-scroll ").hover(function () {

		            $(".image-container").fadeIn(300);

		        });



		        $(".box, .button-buton, .link-button, .text-button, .list-button, .header-button, .area-button, .file-button").mouseover(function () {

		            $(".image-container").fadeOut(300);

		        });

		        // file container 

		        $(".file-button, .file-scroll ").hover(function () {

		            $(".file-container").fadeIn(300);

		        });



		        $(".box, .button-buton, .link-button, .text-button, .list-button, .header-button, .area-button, .image-button").mouseover(function () {

		            $(".file-container").fadeOut(300);

		        });

		        $(".image-data").mousemove(function (e) {
		            var h = $(this).height() + 15;
		            var offset = $(this).offset();
		            var position = (e.pageY - offset.top) / h;

		            if (position < 0.15) {
		                $(this).stop().animate({ scrollTop: 0 }, 1000);
		            }
		            if (position < 0.85 && position > 0.15) {
		                $(this).stop();
		            }

		            if (position > 0.85) {
		                $(this).stop().animate({ scrollTop: 10000 }, 100000);
		            }
		        });



		        $.post("/FileBrowser/GetUserPath",
                function output(dir) {
                    bdigital.service.FileService.GetFilesFromDirectory(dir.data, displayImages);

                });




		        // var userPathURL = "https://root.benefithub.info/res/organization/0000000001/0000002947/";



		        $(".file-data").mousemove(function (e) {
		            var h = $(this).height() + 15;
		            var offset = $(this).offset();
		            var position = (e.pageY - offset.top) / h;

		            if (position < 0.15) {
		                $(this).stop().animate({ scrollTop: 0 }, 1000);
		            }
		            if (position < 0.85 && position > 0.15) {
		                $(this).stop();
		            }

		            if (position > 0.85) {
		                $(this).stop().animate({ scrollTop: 10000 }, 100000);
		            }
		        });







		        //slider for header text size
		        $("#slider-range-header").slider({
		            range: "min",
		            value: 36,
		            min: 10,
		            max: 60,
		            slide: function (event, ui) {
		                $("#size_header").val(ui.value + $("#size_type_header option:selected").val());
		            }
		        });
		        $("#size_header").val($("#slider-range-header").slider("value") + $("#size_type_header option:selected").val());

		        //slider for text text size
		        $("#slider-range-text-size").slider({
		            range: "min",
		            value: 12,
		            min: 10,
		            max: 60,
		            slide: function (event, ui) {
		                $("#text_size").val(ui.value + $("#text_size_type option:selected").val());
		            }
		        });
		        $("#text_size").val($("#slider-range-text-size").slider("value") + $("#text_size_type option:selected").val());

		        //slider for image border width
		        $("#slider-range-image-border").slider({
		            range: "min",
		            value: 0,
		            min: 0,
		            max: 5,
		            slide: function (event, ui) {
		                $("#borderpixels_image").val(ui.value + "px");
		            }
		        });
		        $("#borderpixels_image").val($("#slider-range-image-border").slider("value") + ("px"));


		        //slider for link text size
		        $("#slider-range-link-size").slider({
		            range: "min",
		            value: 12,
		            min: 10,
		            max: 60,
		            slide: function (event, ui) {
		                $("#link_size").val(ui.value + $("#link_size_type option:selected").val());
		            }
		        });
		        $("#link_size").val($("#slider-range-link-size").slider("value") + $("#link_size_type option:selected").val());

		        //slider for button border width
		        $("#slider-range-button-border").slider({
		            range: "min",
		            value: 0,
		            min: 0,
		            max: 5,
		            slide: function (event, ui) {
		                $("#borderpixels_button").val(ui.value + "px");
		            }
		        });
		        $("#borderpixels_button").val($("#slider-range-button-border").slider("value") + ("px"));

		        //slider for button text font size
		        $("#slider-range-button-textfontsize").slider({
		            range: "min",
		            value: 14,
		            min: 12,
		            max: 30,
		            slide: function (event, ui) {
		                $("#textfontsize_button").val(ui.value + $("#textfontsize_button_type option:selected").val());
		            }

		        });
		        $("#textfontsize_button").val($("#slider-range-button-textfontsize").slider("value") + $("#textfontsize_button_type option:selected").val());


		        //slider for list text size
		        $("#slider-range-list-text-size").slider({
		            range: "min",
		            value: 12,
		            min: 10,
		            max: 50,
		            slide: function (event, ui) {
		                $("#listtext_size").val(ui.value + $("#listtext_size_type option:selected").val());
		            }
		        });
		        $("#listtext_size").val($("#slider-range-list-text-size").slider("value") + $("#listtext_size_type option:selected").val());


		        //slider for number of list elements 
		        $("#slider-range-list-num").slider({
		            range: "min",
		            value: 1,
		            min: 1,
		            max: 10,
		            slide: function (event, ui) {
		                $("#list_size").val(ui.value);
		            }
		        });
		        $("#list_size").val($("#slider-range-list-num").slider("value"));

		        //slider for list text size if edit or load mode is true
		        $("#slider-range-listedit-text-size").slider({
		            range: "min",
		            value: 12,
		            min: 10,
		            max: 50,
		            slide: function (event, ui) {
		                $("#listtextedit_size").val(ui.value + $("#listtextedit_size_type option:selected").val());
		            }
		        });
		        $("#listtextedit_size").val($("#slider-range-listedit-text-size").slider("value") + $("#listtextedit_size_type option:selected").val());
		        //slider for link text size
		        $("#slider-range-file-size").slider({
		            range: "min",
		            value: 12,
		            min: 10,
		            max: 60,
		            slide: function (event, ui) {
		                $("#file_size").val(ui.value + $("#file_size_type option:selected").val());
		            }
		        });
		        $("#file_size").val($("#slider-range-file-size").slider("value") + $("#file_size_type option:selected").val());








		        // will save html to database 
		        $("#save-button").click(function () {


		            $("#save-state").children().remove();



		            $(".box * ").removeAttr("id").draggable("destroy").resizable("destroy");

		            if (saveindex == 0) {


		                if (newApp == false) {

		                   


		                    var gadget = new Module();
		                    gadget.require('views', 'dynamic-height', 'setprefs');
		                    gadget.enableLinkToCanvas();


		                    var cssJS = '<link href="https://code.benefithub.com/me/Styles/main.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.js"></script><link href="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/Scripts/canvasv.js"></script>';



		                    html_box = $(".boxrow").html();

		                    var html_plus_css = cssJS + html_box;




		                    gadget.setHomeViewHtml(html_plus_css);

		                    var title = $(".editfake").text();

		                    gadget.setTitle(title);


		                    var description = $("#updescription").val();

		                    gadget.setDescription(description);

		                    var thumbnail = $("#upthumbnail").val();

		                    gadget.setThumbnail(thumbnail);

		                    //Load JSON into text field
		                    $("#json").text(JSON.stringify(gadget.getObj()));




		                    var obj = $("#json").val();


		                    var xmlNode = json2xml(JSON.parse(obj));
		                    $("#xml").text(xmlNode);



		                    verifyForUploadSecond();


		                }
		                else {




		                    createNewApp();

		                    var obj = $("#json").val();


		                    var xmlNode = json2xml(JSON.parse(obj));
		                    $("#xml").text(xmlNode);



		                    verifyForUploadSave();


		                    $(".box").remove();



		                    disableLink = true;
		                    newApp = false;


		                    $(".boxrow").append(html_box);



		                    // loads a function to give loaded html editable features 
		                    loadJQuery();




		                } // if newApp end else 
		            } //end if appIndex



		            else {



		                var gadget = new Module();
		                gadget.require('views', 'dynamic-height', 'setprefs');
		                gadget.enableLinkToCanvas();


		                var cssJS = '<link href="https://code.benefithub.com/me/Styles/main.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.js"></script><link href="https://code.benefithub.com/me/jqueryFileTree/jqueryFileTree.css" rel="stylesheet"  type="text/css" /><script type="text/javascript" src="https://code.benefithub.com/me/Scripts/canvasv.js"></script>';



		                html_box = $(".boxrow").html();

		                var html_plus_css = cssJS + html_box;




		                gadget.setHomeViewHtml(html_plus_css);

		                var title = $(".editfake").text();

		                gadget.setTitle(title);


		                var description = $("#updescription").val();

		                gadget.setDescription(description);

		                var thumbnail = $("#upthumbnail").val();

		                gadget.setThumbnail(thumbnail);

		                //Load JSON into text field
		                $("#json").text(JSON.stringify(gadget.getObj()));




		                var obj = $("#json").val();


		                var xmlNode = json2xml(JSON.parse(obj));
		                $("#xml").text(xmlNode);

		                verifyForUploadSecond();

		            }

		            saveindex++;

		        }); // end save button


		        // TOOLBAR CLICK AND DRAGGABLE FUNCTIONS

		        $(".area-button").click(function () {
		            $("#dialog-form-area").dialog("open");
		        });

		        $(".header-button").draggable({
		            helper: 'clone'
		        });

		        $(".text-button").draggable({
		            helper: 'clone'
		        });

		        $(".link-button").draggable({
		            helper: 'clone'
		        });

		        $(".button-button").draggable({
		            helper: 'clone'
		        });

		        $(".list-button").draggable({
		            helper: 'clone'
		        });

		        // Create New button 
		        $("#create-button").click(function () {

		            if (editHTML == '' || editHTML == "undefined") {


		            }
		            else {



		                //		                $(".box").css("margin", "");
		                //		                $(".box").css("width", "620px");
		                //		                $(".box").css("margin-top", "0px");
		                //		                $(".box").css("margin-left", "0px");
		            }

		            disableLink = true;

		            $("body").css("background", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQYV2MMCQzxYSACMIIUzpo1i6DSUYV4g4jo4AEAu2sc+yYhSyQAAAAASUVORK5CYII=)");
		            // shows the toolbar
		            $(".toolbar").show();

		            // to tell if there is a new app being created 
		            newApp = true;

		            //removes everything in preview box and prepares it for next load
		            $("#previewbox").children().remove();
		            $("#previewbox").hide();

		            //hides the main container and goes to the editing container
		            $(".load-container").hide();
		            $("#mini-layout-container").show();


		        });

		        $("#add-button").click(function () {


		            // if nothing selected to load then do not load anything
		            if (editHTML == '' || editHTML == "undefined") {
		                alert("You have not selected an app to add");
		            }
		            else {





		                //$("#dialog-form-add-to-page").dialog("open");
		                //window.top.Ext.widget("portal.installApp", {gadgetID : appID}).show();
		                addGadgetToPage();
		            }
		        });
		        $("#share-button").click(function () {


		            // if nothing selected to load then do not load anything
		            if (editHTML == '' || editHTML == "undefined") {
		                alert("You have not selected an app to share");
		            }
		            else {


		                window.top.Ext.widget("portal.shareApp", { gadgetID: appID }).show();
		                // window.top.Ext.widget("portal.shareApp").show();

		            }
		        });


		        // Go Back Button
		        $("#go-back-button").click(function () {

		            // checks for a new or existing app 
		            if (newApp == true) {

		                $("#dialog-form-back-add").dialog("open");

		            }
		            else {
		                newApp = false;
		                $("#dialog-form-back-update").dialog("open");
		            }


		        });

		        //makes items droppable to box class 
		        callDroppable();


		        //neded for initial page load and when apps are loaded from datatabase 
		        //user defined function for droppable items 
		        function callDroppable() {



		            $(".box").droppable({

		                drop: function (event, ui) {

		                    //HEADER BUTTON 

		                    if (($(ui.draggable).attr("class")) == "header-button ui-draggable") {

		                        loadMode = false;

		                        var headX = event.pageX - $(this).offset().left;
		                        var headY = event.pageY - $(this).offset().top;

		                        $(".box").append("<p class=header id=header" + headerindex + "><span class=editheader id=editheader" + headerindex + ">Click To Edit Text</span></p>");

		                        $(function () {
		                            $("#editheader" + headerindex).editable({ onEdit: begin });
		                            function begin() { }
		                        });
		                        $("#header" + headerindex).css("font-size", $("#size_header").val());
		                        $("#header" + headerindex).css("position", "absolute");
		                        $("#header" + headerindex).css("left", headX);
		                        $("#header" + headerindex).css("top", headY);
		                        $("#header" + headerindex).css("font-family", "Segoe UI Light");
		                        $("#header" + headerindex).css("color", $("#textcolor_header").val());
		                        $("#header" + headerindex).append("<img class=exitheader src=https://code.benefithub.com/me/images/close.png alt=close  /></img>");
		                        $(".header").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		                        $(".exitheader").hide();

		                        $(".header").mouseover(function () {
		                            $(".exitheader").show();
		                        });
		                        $(".header").mousedown(function () {
		                            $(".exitheader").show();
		                        });
		                        $(".header").mouseleave(function () {
		                            $(".exitheader").hide();
		                        });

		                        //removes selected object
		                        $(".exitheader").click(function () {
		                            $(this).parent().remove();
		                        });


		                        $(function () {
		                            $(".header").resizable({

		                                containment: ".box"
		                            });
		                        });

		                        $(".header").bind("contextmenu", function (e) {

		                            selectedElement = $(this);
		                            $("#dialog-form-header").dialog("open");


		                            return false;
		                        });

		                        headerindex++;

		                    }

		                    //TEXT BUTTON 

		                    if (($(ui.draggable).attr("class")) == "text-button ui-draggable") {

		                        loadMode = false;

		                        var textX = event.pageX - $(this).offset().left;
		                        var textY = event.pageY - $(this).offset().top;


		                        var str = "";

		                        $("#font_familytext").change(function () {

		                            $("#font_familytext option:selected").each(function () {
		                                str += $(this).text() + " ";
		                            });

		                        })
                            .trigger('change');

		                        $(".box").append("<p id=text" + textindex + " class=text ><span class=edittext id=edittext" + textindex + ">Click To Edit Text</span><img class=exittext src=https://code.benefithub.com/me/images/close.png alt=close /></p>");

		                        $(function () {
		                            $(".text").resizable({

		                                containment: ".box"
		                            });
		                        });

		                        $(function () {
		                            $("#edittext" + textindex).editable({ onEdit: begin });
		                            function begin() { }
		                        });

		                        $("#text" + textindex).css("position", "absolute");
		                        $("#text" + textindex).css("left", textX);
		                        $("#text" + textindex).css("top", textY);

		                        $("#text" + textindex).css("font-size", $("#text_size").val());
		                        $("#text" + textindex).css("color", $("#text_color").val());
		                        //  $("#text" + textindex).append("<img class=exit src=https://code.benefithub.com/me/images/close.png alt=close /></img>");

		                        $(".text").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		                        if ($("#text_boldtext").attr("checked")) {
		                            $("#text" + textindex).css("font-weight", $("#text_boldtext").val());
		                        }
		                        if ($("#text_italictext").attr("checked")) {
		                            $("#text" + textindex).css("font-style", $("#text_italictext").val());
		                        }

		                        $(".exittext").hide();

		                        $(".text").mouseover(function () {
		                            $(".exittext").show();
		                        });
		                        $(".text").mousedown(function () {
		                            $(".exittext").show();
		                        });
		                        $(".text").mouseleave(function () {
		                            $(".exittext").hide();
		                        });



		                        //removes selected object
		                        $(".exittext").click(function () {
		                            $(this).parent().remove();
		                        });

		                        $(".text").bind("contextmenu", function (e) {
		                            // check if right button is clicked
		                            selectedElement = $(this);


		                            $("#dialog-form-text").dialog("open");
		                            return false;
		                        });

		                        textindex++;
		                    }

		                    //   IMAGE BUTTON


		                    if (($(ui.draggable).attr("class")) == "image-scroll ui-draggable") {

		                        loadMode = false;

		                        var imageX = event.pageX - $(this).offset().left;
		                        var imageY = event.pageY - $(this).offset().top;


		                        $(".box").append($(ui.draggable).clone().attr('id', "image" + imageindex));
		                        $("#image" + imageindex).attr("class", "image-clone");
		                        $("#image" + imageindex).children().attr("class", "img-clone");
		                        $("#image" + imageindex).css("position", "absolute");
		                        $("#image" + imageindex).css("left", imageX);
		                        $("#image" + imageindex).css("top", imageY);
		                        $("#image" + imageindex).append("<img class=exitimage src=https://code.benefithub.com/me/images/close.png alt=close />");

		                        $("#image" + imageindex).draggable({


		                            containment: '.box'


		                        });


		                        $(".exitimage").hide();

		                        $(".image-clone").mouseover(function () {
		                            $(".exitimage").show();
		                        });
		                        $(".image-clone").mousedown(function () {
		                            $(".exitimage").show();
		                        });
		                        $(".image-clone").mouseleave(function () {
		                            $(".exitimage").hide();
		                        });






		                        //                            //                            $(".box").append("<div class=image id=image" + imageindex + "><img class=img id=img" + imageindex + " src=" + $("#url_image").val() + " alt=\"" + $("#alt_image").val() + "\"  width=200px height=200x /></div>");

		                        $("#img" + imageindex).css("border", ($("#borderpixels_image").val() + " solid " + $("#bordercolor_image").val()));



		                        //makes the box resizable 
		                        $(function () {
		                            $(".image-clone").resizable({
		                                maxHeight: 320,
		                                maxWidth: 320,
		                                minHeight: 10,
		                                minWidth: 10,

		                                containment: ".box"
		                            });
		                        });

		                        $("#image" + imageindex).draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		                        //removes selected object
		                        $(".exitimage").click(function () {
		                            $(this).parent().remove();
		                        });

		                        $(".image-clone").bind("contextmenu", function (e) {
		                            // right button is clicked
		                            selectedElement = $(this);

		                            $("#dialog-form-image").dialog("open");
		                            return false;
		                        });


		                        imageindex++;
		                    }

		                    //LINK BUTTON

		                    if (($(ui.draggable).attr("class")) == "link-button ui-draggable") {

		                        loadMode = false;

		                        var linkX = event.pageX - $(this).offset().left;
		                        var linkY = event.pageY - $(this).offset().top;



		                        $("#link_description").val("Link");

		                        //$(".box").append("<p class=link id=linkdiv" + linkindex + " ><a class=linktext id=link" + linkindex + "  onclick=openWindow(\'" + fillerLink + "\') href='#' ><span >" + $("#link_description").val() + "</span></a><img class=exitlink src=https://code.benefithub.com/me/images/close.png alt=close /></p>")
		                        $(".box").append("<div><p id=link" + linkindex + " class=link ><a class=linktext id=editlink" + linkindex + ">" + $("#link_description").val() + "</a><img class=exitlink src=https://code.benefithub.com/me/images/close.png alt=close /></p></div>");
		                        $("#link" + linkindex).css("position", "absolute");
		                        $("#link" + linkindex).css("left", linkX);
		                        $("#link" + linkindex).css("top", linkY);

		                        $("#editlink" + linkindex).css("color", $("#link_color").val());
		                        //$("#editlink" + linkindex).css("font-size", $("#link_size").val());
		                        $("#editlink" + linkindex).css("text-decoration", $("#link_decoration option:selected").text());
		                        $("#link" + linkindex).draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		                        // $(".link").append("");


		                        $(".exitlink").hide();

		                        $(".link").mouseover(function () {
		                            $(".exitlink").show();
		                        });
		                        $(".link").mousedown(function () {
		                            $(".exitlink").show();
		                        });
		                        $(".link").mouseleave(function () {
		                            $(".exitlink").hide();
		                        });


		                        //removes selected object
		                        $(".exitlink").click(function () {

		                            $(this).parent().remove();
		                        });

		                        $(".link").bind("contextmenu", function (e) {
		                            // right button is clicked
		                            selectedElement = $(this);
		                            linkEdit = $(this).find("a");

		                            $("#dialog-form-link").dialog("open");
		                            return false;
		                        });



		                        linkindex++;



		                    }





		                    //BUTTON BUTTON 

		                    if (($(ui.draggable).attr("class")) == "button-button ui-draggable") {

		                        loadMode = false;

		                        var buttonX = event.pageX - $(this).offset().left;
		                        var buttonY = event.pageY - $(this).offset().top;

		                        var fillerLink = 'Example Link';



		                        var buttonText = "Button Text";


		                        $("#buttonlink_description").val(buttonText);


		                        $(".box").append("<a href='#' class=buttonlink id=buttonlink" + buttonindex + " ><div class=button id=button" + buttonindex + "></div></a>");
		                        $("#button" + buttonindex).append("<p class=buttontext id=buttontext" + buttontextindex + " >" + $("#buttonlink_description").val() + "</p>");
		                        $("#button" + buttonindex).append("<img class=exitbutton src=https://code.benefithub.com/me/images/close.png alt=close /></img>");
		                        $("#button" + buttonindex).css("position", "absolute");
		                        $("#button" + buttonindex).css("left", buttonX);
		                        $("#button" + buttonindex).css("top", buttonY);

		                        $("#buttontext" + buttontextindex).css("font-size", $("#textfontsize_button").val());
		                        $("#buttontext" + buttontextindex).css("color", $("#textcolor_button").val());

		                        $("#buttontext" + buttontextindex).css("font-family", "Segoe UI Light");
		                        $("#button" + buttonindex).css("border", ($("#borderpixels_button").val() + " solid " + $("#bordercolor_button").val()));
		                        $("#button" + buttonindex).css("background-color", $("#bgcolor_button").val());
		                        $("#button" + buttonindex).on("mouseover", ($("#button" + buttonindex).css("cursor", "pointer")));

		                        var containButton = $("#button" + buttonindex);

		                        $("#button" + buttonindex).draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		                        //makes the button resizable 
		                        $(function () {

		                            $(".button").resizable({
		                                maxHeight: 100,
		                                maxWidth: 300,
		                                minHeight: 50,
		                                minWidth: 150
		                            });
		                        });


		                        $(".exitbutton").hide();

		                        $(".buttonlink").mouseover(function () {
		                            $(".exitbutton").show();
		                        });
		                        $(".buttonlink").mousedown(function () {
		                            $(".exitbutton").show();
		                        });
		                        $(".buttonlink").mouseleave(function () {
		                            $(".exitbutton").hide();
		                        });



		                        $(function () {
		                            $('.edit').editable({ onEdit: begin });
		                            function begin() { }
		                        });

		                        //removes selected object
		                        $(".exitbutton").click(function () {

		                            $(this).parent().remove();
		                            return false;
		                        });

		                        $(".buttonlink").bind("contextmenu", function (e) {

		                            divElement = $(this).find("div.button");
		                            selectedElement = $(this);
		                            childElement = $(this).find("p");


		                            $("#dialog-form-button").dialog("open");
		                            return false;
		                        });

		                        buttonindex++;
		                        buttontextindex++;

		                    }


		                    //FILE BUTTON 
		                    //FILE BUTTON 
		                    if (($(ui.draggable).attr("class")) == "file ext_doc ui-draggable" || ($(ui.draggable).attr("class")) == "file ext_docx" || ($(ui.draggable).attr("class")) == "file ext_xls ui-draggable" || ($(ui.draggable).attr("class")) == "file ext_pdf ui-draggable" || ($(ui.draggable).attr("class")) == "file ext_ppt ui-draggable" || ($(ui.draggable).attr("class")) == "file ext_txt ui-draggable") {





		                        loadMode = false;

		                        var fileX = event.pageX - $(this).offset().left;
		                        var fileY = event.pageY - $(this).offset().top;


		                        if (($(ui.draggable).attr("class")) == "file ext_xls ui-draggable") {

		                            $(".box").append("<div class=filetree ><ul class=jqueryFileTree id=filetree" + fileindex + "></ul></div>");
		                            $("#filetree" + fileindex).append($(ui.draggable).clone().attr('id', "file" + fileindex));
		                            $("#file" + fileindex).attr("class", "file ext_xls");

		                        }

		                        else if (($(ui.draggable).attr("class")) == "file ext_pdf ui-draggable") {

		                            $(".box").append("<div class=filetree ><ul class=jqueryFileTree id=filetree" + fileindex + "></ul></div>");
		                            $("#filetree" + fileindex).append($(ui.draggable).clone().attr('id', "file" + fileindex));
		                            $("#file" + fileindex).attr("class", "file ext_pdf");

		                        }
		                        else if (($(ui.draggable).attr("class")) == "file ext_txt ui-draggable") {

		                            $(".box").append("<div class=filetree ><ul class=jqueryFileTree id=filetree" + fileindex + "></ul></div>");
		                            $("#filetree" + fileindex).append($(ui.draggable).clone().attr('id', "file" + fileindex));
		                            $("#file" + fileindex).attr("class", "file ext_txt");

		                        }
		                        else if (($(ui.draggable).attr("class")) == "file ext_ppt ui-draggable") {

		                            $(".box").append("<div class=filetree ><ul class=jqueryFileTree id=filetree" + fileindex + "></ul></div>");
		                            $("#filetree" + fileindex).append($(ui.draggable).clone().attr('id', "file" + fileindex));
		                            $("#file" + fileindex).attr("class", "file ext_ppt");

		                        }
		                        else if (($(ui.draggable).attr("class")) == "file ext_doc ui-draggable" || ($(ui.draggable).attr("class")) == "file ext_docx ui-draggable") {

		                            $(".box").append("<div class=filetree ><ul class=jqueryFileTree id=filetree" + fileindex + "></ul></div>");
		                            $("#filetree" + fileindex).append($(ui.draggable).clone().attr('id', "file" + fileindex));
		                            $("#file" + fileindex).attr("class", "file ext_doc");

		                        }


		                        $("#file" + fileindex).children().attr("id", "filelink" + fileindex);
		                        $("#file" + fileindex).children().attr("class", "jQueryFileTree");
		                        $("#file" + fileindex).css("position", "absolute");
		                        $("#file" + fileindex).css("left", fileX);
		                        $("#file" + fileindex).css("top", fileY);
		                        $("#filelink" + fileindex).css("color", $("#file_color").val());
		                        $("#file" + fileindex).css("font-size", $("#file_size").val());
		                        $("#filelink" + fileindex).css("text-decoration", $("#file_decoration option:selected").text());
		                        $("#file" + fileindex).append("<img class=exitfile src=https://code.benefithub.com/me/images/close.png alt=close />");



		                        $("#file" + fileindex).draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });


		                        $(".exitfile").hide();

		                        $(".jqueryFileTree").mouseover(function () {
		                            $(".exitfile").show();
		                        });
		                        $(".jqueryFileTree").mousedown(function () {
		                            $(".exitfile").show();
		                        });
		                        $(".jqueryFileTree").mouseleave(function () {
		                            $(".exitfile").hide();
		                        });



		                        //removes selected object
		                        $(".exitfile").click(function () {

		                            $(this).parent().remove();

		                        });

		                        $("#file" + fileindex).bind("contextmenu", function (e) {
		                            // right button is clicked
		                            selectedElement = $(this);

		                            $("#dialog-form-file").dialog("open");
		                            return false;
		                        });


		                        fileindex++;
		                    }

		                    //LIST BUTTON 

		                    if (($(ui.draggable).attr("class")) == "list-button ui-draggable") {
		                        loadMode = false;
		                        $("#dialog-form-list").dialog("open");
		                    }
		                }

		            });

		        }  // end callDroppable function







		        // Will get the selected app from the database when clicked and 
		        // will send a copy of the HTML to the preview box 

		        $("#apps tbody tr td").live('click', function () {

		            // removes anything in the preview box before HTML goes inside
		            $("#previewbox").children().remove();

		            //gets the value that is in the first row
		            //the first row is hidden and contains the primary key for that app 
		            appNumber = $(this).parents('tr:first').find('.hiddenbox').val();

		            // takes the value of the variable and sets it as the value to retrieve the selected app 
		            $("#appId").val(appNumber);

		            // retrieves the app from the database 
		            find();

		            // appends html to preview box 
		            $("#previewbox").append($("#html_content").val());

		            // needed to shrink previewbox to fit area 


		            $("#previewbox").show();



		        });

		        // will remove selected app from the database 
		        $("#delete-button").live('click', function () {


		            // checks if an app is selected 
		            if (editHTML == '' || editHTML == "undefined") {
		                alert("You have not selected an app to delete");

		            }
		            else {

		                $("#dialog-form-remove").dialog("open");

		            }

		            //resets value back to zero 
		            $("#appId").val(0);

		        }); // end delete button click


		        //loads selected app 
		        $("#edit-button").click(function () {



		            $(".editfake").text($("#app" + appID).text());


		            $("#updescription").val("Enter Description");


		            var appThumb = $("#img" + appID).attr("src");

		            $("#upthumbnail").val(appThumb);


		            // if nothing selected to load then do not load anything
		            if (editHTML == '' || editHTML == "undefined") {
		                alert("You have not selected an app to edit");

		            }
		            else {

		                disableLink = true;
		                newApp = false;


		                $("#previewbox").children().remove();
		                $("#previewbox").hide();
		                $("#previewbox").children().remove();
		                $("#previewbox").hide();

		                $(".box").css("margin", "");

		                $(".box").css("margin-top", "100px");
		                $(".box").css("margin-left", "200px");

		                $("html").css("background", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQYV2MMCQzxYSACMIIUzpo1i6DSUYV4g4jo4AEAu2sc+yYhSyQAAAAASUVORK5CYII=)");


		                $(".toolbar").show();

		                $(".box").remove();

		                $(".boxrow").append(editHTML);



		                $(".load-container").hide();
		                $("#mini-layout-container").show();


		                // loads a function to give loaded html editable features 
		                loadJQuery();


		            } //end else 



		        }); // end load button click


		        // function to give loaded html editable features 
		        function loadJQuery() {




		            //		            $(".box").resizable({
		            //		                maxHeight: 320,
		            //		                maxWidth: 640,
		            //		                minHeight: 320,
		            //		                minWidth: 320,
		            //		                grid: 320,
		            //		                alsoResize: ".box"
		            //		            });


		            /**************** TEXT ******************/

		            $(function () {
		                $(".text").resizable({
		                    containment: ".box"
		                });
		            });


		            $(".exittext").hide();

		            $(".text").mouseover(function () {
		                $(".exittext").show();
		            });
		            $(".text").mousedown(function () {
		                $(".exittext").show();
		            });
		            $(".text").mouseleave(function () {
		                $(".exittext").hide();
		            });

		            //removes selected object
		            $(".exittext").click(function () {
		                $(this).parent().remove();
		            });


		            $(function () {
		                $('.edittext').editable({ onEdit: begin });
		                function begin() { }
		            });

		            $(".text").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		            $(".text").bind("contextmenu", function (e) {

		                loadElement = $(this);
		                loadMode = true;
		                $("#dialog-form-text").dialog("open");
		                return false;
		            });

		            /**************** HEADER ******************/
		            $(function () {
		                $(".editheader").editable({ onEdit: begin });
		                function begin() { }
		            });



		            $(".header").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		            $(function () {
		                $(".header").resizable({
		                    containment: ".box"
		                });
		            });


		            $(".exitheader").hide();

		            $(".header").mouseover(function () {
		                $(".exitheader").show();
		            });
		            $(".header").mousedown(function () {
		                $(".exitheader").show();
		            });
		            $(".header").mouseleave(function () {
		                $(".exitheader").hide();
		            });


		            //removes selected object
		            $(".exitheader").click(function () {
		                $(this).parent().remove();
		            });

		            $(".header").bind("contextmenu", function (e) {


		                loadElement = $(this);
		                loadMode = true;
		                $("#dialog-form-header").dialog("open");


		                return false;
		            });

		            /**************** IMAGE ******************/


		            $(".exitimage").hide();

		            $(".image-clone").mouseover(function () {
		                $(".exitimage").show();
		            });
		            $(".image-clone").mousedown(function () {
		                $(".exitimage").show();
		            });
		            $(".image-clone").mouseleave(function () {
		                $(".exitimage").hide();
		            });

		            $(".exitimage").click(function () {

		                $(this).parent().remove();
		            });


		            $(function () {
		                $(".image-clone").resizable({


		                    containment: ".box"
		                });
		            });


		            $(".image-clone").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });


		            $(".img-clone").bind("contextmenu", function (e) {

		                loadElement = $(this);
		                loadMode = true;
		                $("#dialog-form-image").dialog("open");
		                return false;
		            });

		            /**************** LINK ******************/
		            $(".link").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });




		            $(".link").mouseover(function () {
		                $(".exitlink").show();
		            });
		            $(".link").mousedown(function () {
		                $(".exitlink").show();
		            });
		            $(".link").mouseleave(function () {
		                $(".exitlink").hide();
		            });


		            //removes selected object
		            $(".exitlink").click(function () {

		                $(this).parent().remove();
		            });

		            $(".link").bind("contextmenu", function (e) {

		                loadElement = $(this);
		                loadLinkEdit = $(this).find("a");
		                loadMode = true;
		                $("#dialog-form-link").dialog("open");
		                return false;
		            });

		            /**************** BUTTON ******************/
		            $(".button").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });
		            //makes the button resizable 

		            //makes the button resizable 
		            $(function () {

		                $(".button").resizable({
		                    maxHeight: 100,
		                    maxWidth: 300,
		                    minHeight: 50,
		                    minWidth: 150
		                });
		            });

		            $(".exitbutton").hide();

		            $(".buttonlink").mouseover(function () {
		                $(".exitbutton").show();
		            });
		            $(".buttonlink").mousedown(function () {
		                $(".exitbutton").show();
		            });
		            $(".buttonlink").mouseleave(function () {
		                $(".exitbutton").hide();
		            });

		            $(".exitbutton").click(function () {

		                $(this).parent().remove();
		                return false;
		            });



		            $(function () {
		                $('.edit').editable({ onEdit: begin });
		                function begin() { }
		            });

		            $(".buttonlink").bind("contextmenu", function (e) {

		                loadElement = $(this);
		                divLoadElement = $(this).find("div.button");
		                childLoadElement = $(this).find("p");
		                parentLoadElement = $(this).find("a.buttonlink");
		                loadMode = true;
		                $("#dialog-form-button").dialog("open");
		                return false;
		            });

		            /************LIST*************************/
		            $(".ulist").bind("contextmenu", function (e) {

		                loadElement = $(this);

		                loadMode = true;
		                $("#dialog-form-list-edit").dialog("open");
		                return false;
		            });


		            $(".olist").bind("contextmenu", function (e) {

		                loadElement = $(this);
		                loadMode = true;
		                $("#dialog-form-list").dialog("open");
		                return false;
		            });


		            $(function () {
		                $(".ulist").resizable({

		                    maxWidth: 900,

		                    containment: ".box"
		                });
		            });

		            $(function () {
		                $(".olist").resizable({

		                    maxWidth: 900,

		                    containment: ".box"
		                });
		            });



		            $(function () {
		                $('.editlist').editable({ onEdit: begin });
		                function begin() { }
		            });



		            $(".ulist").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });
		            $(".olist").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });



		            //removes selected object
		            $(".exitulist").click(function () {
		                $(this).parent().remove();
		            });

		            //removes selected object
		            $(".exitolist").click(function () {
		                $(this).parent().remove();
		            });

		            /*********************** File **********************/


		            $(".filetree").draggable({ guides: true, snapTolerance: 1, containment: '.box', guidepadding: 0, guideinner: '.box' });

		            $(".exitfile").hide();

		            $(".jqueryFileTree").mouseover(function () {
		                $(".exitfile").show();
		            });
		            $(".jqueryFileTree").mousedown(function () {
		                $(".exitfile").show();
		            });
		            $(".jqueryFileTree").mouseleave(function () {
		                $(".exitfile").hide();
		            });


		            //removes selected object
		            $(".exitfile").click(function () {
		                $(this).parent().remove();
		            });

		            $(".filetree").bind("contextmenu", function (e) {

		                loadElement = $(this).find("a");
		                loadMode = true;
		                $("#dialog-form-file").dialog("open");
		                return false;
		            });


		            // Call Droppable function to enable droppable feature 
		            callDroppable();

		        } // end load functions 


		    });

        function RenderTemplateLayout(id, template) {

            //create table, rows
            var div = $("<div />", { "id": id, "class": "layout-wrapper" });
            var table = $("<table />", { "id": "table" + id });
            var tr = [];
            for (i = 1; i <= template.dimensions.rows; i++) {
                tr.push($("<tr />"));
            }

            //create columns
            var rowindex = 0, colindex = 0, remainderindex = 0;
            $.each(template.boxes, function () {

                //create row
               var td = $("<td class=boxrow/>", { "colspan": this.colspan, "rowspan": this.rowspan });
               tr[rowindex].append(td);
               $(".boxrow").css("width", "450px");
                //adjust indexes
                if (parseInt(this.rowspan) > 1) { remainderindex++; }
                colindex = colindex + parseInt(this.colspan);

                //add complete row to table
                if (colindex == template.dimensions.cols) {

                    table.append(tr[rowindex]);

                    rowindex++;
                    colindex = remainderindex;
                    remainderindex = 0;
                }
            });

            //complete
            div.append(table);
        $("#mini-layout-container").append(div);
        }

        

      


            ///  The below function is a callback that receives a response from the bdigital service.
            ///  The response contains three elements:
            ///     1 - success: true or false
            ///     2 - messages: messages from the controller
            ///     3 - data: the actual data returned.  
            ///
       function displayImages(response) {

           $.each(response.data, function () {
               if (this.fileurl.indexOf(".jpg") > 0 || this.fileurl.indexOf(".gif") > 0 || this.fileurl.indexOf(".png") > 0) {
                   var img = '';
                   img += '<div class="image-scroll">';
                   img += '<img class="img-scroll" src="https://' + window.location.host + '/' + this.fileurl + '" />';
                   img += '</div>';
                   $(".image-data").append(img);



                   $(".image-scroll").draggable({
                       helper: 'clone'

                   });
               } // end if 

               if (this.fileurl.indexOf(".doc") > 0 || this.fileurl.indexOf(".docx") > 0) {

                   if (this.filename.length > 25) {


                       var shortText = jQuery.trim(this.filename).substring(0, 20) + "...";



                   }
                   else {


                       var shortText = this.filename;
                   }


                   var doc = '';
                   doc += '<li class="file ext_doc"><a target="_blank" href="https://' + window.location.host + '/' + this.fileurl + '" rel="https://' + window.location.host + '/' + this.fileurl + '">' + shortText + '</a></li>';

                   $(".jqueryFileTree").append(doc);

                   $(".file").draggable({
                       helper: 'clone'

                   });

               }

               if (this.fileurl.indexOf(".xls") > 0 || this.fileurl.indexOf(".xlsx") > 0) {

                   if (this.filename.length > 25) {


                       var shortText = jQuery.trim(this.filename).substring(0, 20) + "...";
                   }
                   else {


                       var shortText = this.filename;
                   }

                   var doc = '';

                   doc += '<li class="file ext_xls" ><a target="_blank" href="https://' + window.location.host + '/' + this.fileurl + '" rel="https://' + window.location.host + '/' + this.fileurl + '">' + shortText + '</a></li>';


                   $(".jqueryFileTree").append(doc);

                   $(".file").draggable({
                       helper: 'clone'

                   });


                    
               }
               if (this.fileurl.indexOf(".pdf") > 0) {


                   if (this.filename.length > 25) {


                       var shortText = jQuery.trim(this.filename).substring(0, 20) + "...";
                   }
                   else 
                   {


                       var shortText = this.filename;
                   }

                   var doc = '';

                   doc += '<li class="file ext_pdf" ><a target="_blank" href="https://' + window.location.host + '/' + this.fileurl + '" rel="https://' + window.location.host + '/' + this.fileurl + '">' + shortText + '</a></li>';


                   $(".jqueryFileTree").append(doc);

                   $(".file").draggable({
                       helper: 'clone'

                   });

               }

               if (this.fileurl.indexOf(".ppt") > 0) {


                   if (this.filename.length > 25) {


                       var shortText = jQuery.trim(this.filename).substring(0, 20) + "...";
                   }
                   else {


                       var shortText = this.filename;
                   }

                   var doc = '';

                   doc += '<li class="file ext_ppt" ><a target="_blank" href="https://' + window.location.host + '/' + this.fileurl + '" rel="https://' + window.location.host + '/' + this.fileurl + '">' + shortText + '</a></li>';


                   $(".jqueryFileTree").append(doc);

                   $(".file").draggable({
                       helper: 'clone'

                   });

               }

               if (this.fileurl.indexOf(".txt") > 0) {

                   if (this.filename.length > 25) {


                       var shortText = jQuery.trim(this.filename).substring(0, 20) + "...";
                   }
                   else {


                       var shortText = this.filename;
                   }


                   var doc = '';
                   doc += '<li class="file ext_txt" ><a target="_blank" href="https://' + window.location.host + '/' + this.fileurl + '" rel="https://' + window.location.host + '/' + this.fileurl + '">' + shortText + '</a></li>';

                   $(".jqueryFileTree").append(doc);

                   $(".file").draggable({
                       helper: 'clone'

                   });

               }









           });        // end each
        } // end function


  