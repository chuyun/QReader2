/**
 * Created by jun on 2016/11/23.
 */

/**
 * @author  info_together@aliyun.com
 * @description 二维码生成
 * @param {}
 * @return {}
 */
requirejs.config({
    baseUrl: 'js/libs',
    shim: {
        jsQR: {
            deps: [],
            exports: 'jsQR'
        },
        jquery: {
            deps: [],
            exports: '$'
        },
        zclip: {
            deps: ["jquery"],
            exports: 'zclip'
        },
        qrcode: {
            deps: ["jquery"],
            exports: 'qrcode'
        }
    },
    paths: {
        "jquery": "jquery.min",
        "zclip": "jquery.zclip",
        "qrcode": "qrcode.min"
    }

});

requirejs(["jquery", "qrcode", "tools"],
    function ($, qrcode, tools) {

        /*NeDB*/
        const ipcRenderer = require('electron').ipcRenderer;

        //初始化设置
        var qrcode = new QRCode(document.getElementById("show"), {
            width: 190,
            height: 190,
            useSVG: true
        });
        //生成QRCode
        function makeCode() {
            var elText = document.getElementById("input-area");

            if (!elText.value) {
                // alert("Input a text");
                elText.focus();
                // return;
            }
            qrcode.makeCode(elText.value);
        }

        makeCode();

        $("#input-area").on("blur", function () {
            makeCode();
        }).on("keydown", function (e) {
            if (e.keyCode == 13) {
                makeCode();
                var text = document.getElementById("input-area").value;

                var encodeObj = {
                    type: 'encode',
                    text: text,
                    recentTime: tools.getNowFormatDate()
                }

                if (encodeObj.text) {
                    ipcRenderer.send('save-db', encodeObj.type, encodeObj.text, encodeObj.recentTime);
                }
            }

        }).on("keypress", function () {
            makeCode();
        });


    });
