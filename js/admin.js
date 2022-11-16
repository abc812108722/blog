let t = window.localStorage.getItem('Authorization')
if(t){
    axios({
        method:"post",
        url:"/verifyadmin",
        data:{
            token:t
        }
    }).then(res => {
        let k = res.data.status
        switch(k){
            case 0:
                window.location = "/index.html";
                break;
            case 1:
                break;
            case 2:
                window.location = "/index.html";
                break;
        }
    },reason => {
        window.location = "/index.html"
    })
    
}else{
    window.location = "/index.html"
}
// 替换掉所有匹配的字符
String.prototype.replaceAll = function(f, e) { //吧f替换成e
    var reg = new RegExp(f, "g"); //创建正则RegExp对象   
    return this.replace(reg, e);
}
//字符串 -> dom
function stringToDom(arg) {

    var objE = document.createElement("div");
    
    objE.innerHTML = arg;
    
    return objE.childNodes;
    
    };
//dom -> 字符串
function domToString ( node ) {  
        //createElement()返回一个Element对象
    var tmpNode = document.createElement( "div" ); 
       //appendChild()  参数Node对象   返回Node对象  Element方法
       //cloneNode()  参数布尔类型  返回Node对象   Element方法
    for(let i=0; i<node.length;i++){
        tmpNode.appendChild( node[i].cloneNode( true ) );
    }
      
    var str = tmpNode.innerHTML;  
    tmpNode = node = null; // prevent memory leaks in IE  
    return str;  
    } 



window.addEventListener('load', () => {
    const { createEditor, createToolbar } = window.wangEditor
        
        const editorConfig = {
            placeholder: 'Type here...',
            onChange(editor) {
              const html = editor.getHtml()
              console.log('editor content', html)
              // 也可以同步到 <textarea>
            }
        }
        
        const editor = createEditor({
            selector: '#editor-container',
            html: '<p><br></p>',
            config: editorConfig,
            mode: 'default', // or 'simple'
        })
        
        const toolbarConfig = {}
        toolbarConfig.excludeKeys = [
            "group-image",
            "group-video"
        ]
        
        const toolbar = createToolbar({
            editor,
            selector: '#toolbar-container',
            config: toolbarConfig,
            mode: 'default', // or 'simple'
        })



        //获得全部文章的名称
        axios({
            method:"get",
            url:"/getAllarticleName"
        }).then(res=> {
            let c = document.querySelector('.article_list')
            let data = res.data.data
            for(let i=0; i< data.length; i++){
                let a = document.createElement('div')
                a.setAttribute('class',"article_l")
                let b = document.createElement('div')
                b.setAttribute('class',"article_title")
                b.innerHTML = data[i].article_name
                b.setAttribute("article_id",data[i].article_id)
                b.setAttribute("title",data[i].article_name)
                a.appendChild(b)
                c.appendChild(a)
            }
            let article_l = document.querySelectorAll('.article_l')
            let title = document.querySelector('.title .title_inp')
            let desc = document.querySelector('.desc .title_inp')
            let category = document.querySelector('.category .title_inp')
            if(article_l){
                for(let i=0; i<article_l.length; i++){
                    article_l[i].addEventListener('click', () => {
                        for(let j=0; j<article_l.length; j++){
                            article_l[j].style.backgroundColor = "white"
                            article_l[j].removeAttribute("isselected")
                        }
                        
                        article_l[i].style.backgroundColor = "antiquewhite"
                        article_l[i].setAttribute("isselected","true")
                        let article_id = article_l[i].children[0].getAttribute("article_id")
                        axios({
                            method:"get",
                            url:"/getSingleArticle",
                            params:{
                                article_id:article_id
                            }
                        }).then(res => {
                            if(res.data.status == 0){
                                alert(res.data.message)
                            }else{
                                let btn2 = document.querySelector('#btn2')
                                let btn3 = document.querySelector('#btn3')
                                title.value = res.data.article_name
                                desc.value = res.data.article_desc
                                category.value = res.data.category
                                editor.setHtml(res.data.article_content)
                                btn2.removeAttribute("disabled")
                                btn3.removeAttribute("disabled")

                            }
                        })

                    })
                }
            }
        })
        //修改文章
        let btn2 = document.querySelector('#btn2')
        btn2.addEventListener('click' ,() => {
            let s = document.querySelector("div[isselected='true']").children[0]
            let article_id_u = s.getAttribute('article_id')
            console.log(article_id_u)
            let title_u = document.querySelector('.title .title_inp')
            let desc_u = document.querySelector('.desc .title_inp')
            let category_u = document.querySelector('.category .title_inp')
            axios({
                method:"post",
                url:"/updateArticle",
                data:{
                    article_id:article_id_u,
                    article_name:title_u.value,
                    article_content:editor.getHtml().replaceAll("`","\\\\`"),
                    article_desc:desc_u.value,
                    category:category_u.value
                }
            }).then(res =>{
                if(res.data.status == 0){
                    alert("修改失败")
                }else{
                   window.location = "/admin.html"   
                }
            })
        })

        //删除文章
        let btn3 = document.querySelector('#btn3')
        btn3.addEventListener('click' ,() => {
            let s = document.querySelector("div[isselected='true']").children[0]
            let article_id_u = s.getAttribute('article_id')
            // let title_u = document.querySelector('.title .title_inp')
            // let desc_u = document.querySelector('.desc .title_inp')
            // let category_u = document.querySelector('.category .title_inp')
            axios({
                method:"get",
                url:"/deleteArticle",
                params:{
                    article_id:article_id_u,
                    // article_name:title_u.value,
                    // article_content:editor.getHtml(),
                    // article_desc:desc_u.value,
                    // category:category_u.value
                }
            }).then(res =>{
                if(res.data.status == 0){
                    alert("删除失败")
                }else{
                   window.location = "/admin.html"   
                }
            })
        })





        //提交文章
        let btn = document.querySelector('#btn1')
        btn.addEventListener('click', ()=> {
            let html =  editor.getHtml()
            // let d = stringToDom(html)
            // for(let j=0;j<d.length;j++){
            //     let code = d[j].querySelectorAll('code')
            //     if(code.length >0) {
            //         for(let i=0; i<code.length; i++){
            //             let p = document.createElement("pre")
            //             p.appendChild(code[i])
            //             d[j].appendChild(p)
            //         }
            //     }
            // }
            
            // html = domToString(d)
            const text = editor.getText()
            let title = document.querySelector('.title .title_inp')
            let desc = document.querySelector('.desc .title_inp')
            let category = document.querySelector('.category .title_inp')
            if(Number(title.value) == 0){
                title.style.border = "1px solid red"
                title.placeholder = "内容不能为空"
                title.setAttribute("class", "title_inp change")
                title.addEventListener('input', () => {
                    title.style.border = "none"
                    title.placeholder = "填写标题"
                    title.setAttribute("class", "title_inp")
                })
            }else if(Number(desc.value) == 0){
                desc.style.border = "1px solid red"
                desc.placeholder = "内容不能为空"
                desc.setAttribute("class", "title_inp change")
                desc.addEventListener('input', () => {
                    desc.style.border = "none"
                    desc.placeholder = "填写描述"
                    desc.setAttribute("class", "title_inp")
                })
            }else if(Number(text) ==0 ){
                editor.setHtml('<p>内容不能为空...</p>')
            }else{
                axios({
                    method:"post",
                    url:"/addarticle",
                    data:{title:title.value,desc:desc.value,category:category.value,html:html.replaceAll("`","\\\\`"),token:t}
                }).then(res=>{
                    let k = res.data.status
                    switch(k){
                        case 0:
                            alert(k.data.message);
                            break;
                        case 1:
                            window.location = "/admin.html"
                            break;
                        case 2:
                            alert(k.data.message);
                            break;
                    }
                })
            }

        })
})