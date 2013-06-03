(function() {
    groupdocs.utils.DEBUG = false;
    //please, contact me for clientId and apiKey
    var clientId = "";
    var apiKey = "";

    var aClient = new groupdocs.ApiClient(new groupdocs.GroupDocsSecurityHandler(apiKey));
    var api = new groupdocs.StorageApi(aClient, "https://dev-api.groupdocs.com/v2.0");

    // Make folders and files list
    var show_list = function (list, $target) {
        //list is object with .folders and .files arrays
        
        //it is not goot to create DOM elements in loop so create them as string
        var folderList = '';
        var fileList = '';

        //Will it be better to marge list folder and list.files and than use one loop
        //and if condition in it for files and folders?
        var length = list.folders.length;
        var element = null;
        for (var i = 0; i < length; i++) {
            element = list.folders[i];
            folderList += "<li class='directory collapsed'><a href='#' rel='" + element.name + "'>" + element.name + "</a></li>";
        }
        // as previous block
        var length = list.files.length;
        var element = null;
        for (var i = 0; i < length; i++) {
            element = list.files[i];
            fileList += "<li class='file ext_" + element.file_type.toLowerCase() + "'><a class='iframe' href='' rel='" + element.guid + "'>" + element.name + "</a></li>";
        }

        //is there any better way to create ul with li and append them to target DOM element
        $target.append('<ul class="jqueryFileTree" style=""></ul>');
        $target.find('.jqueryFileTree').append(folderList);
        $target.find('.jqueryFileTree').append(fileList);
        
        //Is it ok to use separate method or I use to use binging in this one?
        bindEvents($target);
    };

    var bindEvents = function($target) {
        // when click on folder open it and show folder folders and files
        // click on open folder - close folder
        // click on file - just console log
        $target.find('li a').bind('click', function(){
            if( $(this).parent().hasClass('directory') ) {
                if( $(this).parent().hasClass('collapsed') ) {
                    // Expand
                    $(this).parent().find('ul').remove(); // cleanup
                    
                    //get folder content. in rel attribute there is a path for SKD call  
                    //to get content of needed folder
                    getStructure( $(this).parent(), $(this).attr('rel') );
                    $(this).parent().removeClass('collapsed').addClass('expanded');
                } else {
                    // Collapse
                    $(this).parent().find('ul').slideUp(500);
                    $(this).parent().removeClass('expanded').addClass('collapsed');
                }
            } else {
                console.log($(this).attr('rel'));
            }
            return false;
        })
    }

    var getStructure = function (target, path) {
        //for root folder
        path = path || "";
        
        //GroupDocs API call
        api.ListEntities(function(response, status, jqXHR) {
            //console.log("success callback " + status);
            //console.log(response.result);
            if(response.result) {
                show_list(response.result, target);
            }
        }, clientId, path);
    }

    // Is there better way to start application
    var init = function () {
        /*
        // athother API call
        api.GetStorageInfo(function(response) {
            console.log("success callback");
            console.log(response.result);
        }, clientId);
        */
        var $target = $('#filestructure');
        getStructure($target);
    }
    
    $(document).ready( function() {
        init();
    } );

}());

