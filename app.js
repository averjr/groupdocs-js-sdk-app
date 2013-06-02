(function() {
    groupdocs.utils.DEBUG = false;
    var clientId = "80716f88c4e8625e";
    var apiKey = "b72f43ff3d89b9253654e7df50731ca5";

    var aClient = new groupdocs.ApiClient(new groupdocs.GroupDocsSecurityHandler(apiKey));
    var api = new groupdocs.StorageApi(aClient, "https://dev-api.groupdocs.com/v2.0");

    var show_list = function (list, $target) {
        var folderList = '';
        var fileList = '';

        var length = list.folders.length;
        var element = null;
        for (var i = 0; i < length; i++) {
            element = list.folders[i];
            folderList += "<li class='directory collapsed'><a href='#' rel='" + element.name + "'>" + element.name + "</a></li>";
        }

        var length = list.files.length;
        var element = null;
        for (var i = 0; i < length; i++) {
            element = list.files[i];
            fileList += "<li class='file ext_" + element.file_type.toLowerCase() + "'><a class='iframe' href='' rel='" + element.guid + "'>" + element.name + "</a></li>";
        }

        $target.append('<ul class="jqueryFileTree" style=""></ul>');
        $target.find('.jqueryFileTree').append(folderList);
        $target.find('.jqueryFileTree').append(fileList);

        bindEvents($target);
    };

    var bindEvents = function($target) {
        $target.find('LI A').bind('click', function(){
            if( $(this).parent().hasClass('directory') ) {
                if( $(this).parent().hasClass('collapsed') ) {
                    // Expand
                    $(this).parent().find('UL').remove(); // cleanup

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
        path = path || "";
        api.ListEntities(function(response, status, jqXHR) {
            //console.log("success callback " + status);
            //console.log(response.result);
            if(response.result) {
                show_list(response.result, target);
            }
        }, clientId, path);
    }

    var init = function () {
        /*
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

