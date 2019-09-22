var vue = new Vue({
    el:'#app',
    data:{
        word:'',
        wordTran:'',
        exam:'',
        examTran:'',
        words:"",
        wordArray:[],
        novel:"",
        result:[],
        index:0,
        flag:false,
    },
    methods:{

        hid:function(){
            this.flag=!this.flag;
            console.log(this.flag);
        },
        loads:function(){
            this.$refs.examtran.innerHTML = "<div class='loadbox'>\n" +
                "    <img src=\"imgs/load.png\" alt=\"\" class=\"load\">\n" +
                "</div>";
        },
        add:function () {
            vue.loads();
            vue.index++;
            //正则表达式
            var reg = new RegExp("[\\s.!?;]([A-z,':-é]+[\\s])+\\b"+vue.wordArray[vue.index].trim()+" \\b([A-z,':-é]+[\\s?.!;])+","g");
            vue.result = reg.exec(vue.novel);
            // result = novel.match(/[\s,.!]([A-z]+[\s])+\b+wordArray[i]+ \b([A-z]+[\s,.!])+/);
            //将有例句的输出
            if(vue.result!==null){
                vue.word = vue.wordArray[vue.index].trim();
                vue.exam = vue.result[0];
                vue.chinese();
            }else{
                vue.index++;
                vue.add();
            }
            var audio = document.querySelector("#audio");
            audio.innerHTML="";
        },
        sub:function () {
            vue.loads();
            if(vue.index<=0){
                alert("前面没有了!");
                vue.index=0;
            }else{
                vue.index--;
                //正则表达式
                var reg = new RegExp("[\\s.!?;]([A-z,':-é]+[\\s])+\\b"+vue.wordArray[vue.index].trim()+" \\b([A-z,':-é]+[\\s?.!;])+","g");
                vue.result = reg.exec(vue.novel);
                // result = novel.match(/[\s,.!]([A-z]+[\s])+\b+wordArray[i]+ \b([A-z]+[\s,.!])+/);
                //将有例句的输出
                if(vue.result!==null){
                    vue.word = vue.wordArray[vue.index].trim();
                    vue.exam = vue.result[0];
                    vue.chinese();
                }else{
                    vue.index--;
                    vue.sub();
                }

            }
            //停止朗读
            var audio = document.querySelector("#audio");
            audio.innerHTML="";
        },
        chinese:function () {
            // APP ID：20190917000335179
            // 密钥：oVcZwK6Eulo5ZtvN3Jid
            var salt = (new Date).getTime();
            var appid ='20190917000335179';
            var key = 'oVcZwK6Eulo5ZtvN3Jid';
            var q = vue.word;
            var q2 = vue.exam;
            var sign= md5(appid+q+salt+key);
            var sign2= md5(appid+q2+salt+key);
            console.log(sign);
            //翻译单词
            $.ajax({
                url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
                type: 'get',
                dataType: 'jsonp',
                data: {
                    q: q,
                    appid: appid,
                    salt: salt,
                    from: 'auto',
                    to: 'auto',
                    sign: sign
                },
                success: function (data) {
                    vue.wordTran = data.trans_result[0].dst;
                    console.log(data);

                    //翻译句子
                    setTimeout(
                        function () {
                            $.ajax({
                                url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
                                type: 'get',
                                dataType: 'jsonp',
                                data: {
                                    q: q2,
                                    appid: appid,
                                    salt: salt,
                                    from: 'auto',
                                    to: 'auto',
                                    sign: sign2
                                },
                                success: function (data) {
                                    vue.examTran = data.trans_result[0].dst;
                                    vue.$refs.examtran.innerHTML = "<p>"+vue.examTran+"</p>";

                                }
                            });
                        },1050
                    );

                }
            });

        },
        readword:function () {
                    var audio = document.querySelector("#audio");
                    audio.innerHTML=" <audio autoplay='autoplay' src=\"http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=4&text="+vue.word+"\"></audio>";

        },
        readexam:function () {
            var audio = document.querySelector("#audio");
            audio.innerHTML=" <audio autoplay='autoplay' src=\"http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=4&text="+vue.exam+"\"></audio>";

        }
    },
    beforeCreate(){
        //读取词汇表内容
        //创建异步对象
        var xhr = new XMLHttpRequest();
        xhr.open("GET","txt/vocabulary.txt",true);
        xhr.send();
        xhr.onload = function () {
            //将词汇保存到word中
            vue.words = xhr.responseText;
            //将词汇表字符串转换成数组
            vue.wordArray = vue.words.match(/\s[a-z]+\s/g);
            console.log(vue.wordArray);
        };
        //获取小说内容
        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET","txt/The Return of the King.txt",true);
        xhr2.send();
        xhr2.onload = function () {
            //将小说保存到novel中
            vue.novel = xhr2.responseText;
            vue.add();
        };


    },

})
