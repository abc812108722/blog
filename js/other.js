window.addEventListener('load', () => {
    let total_article = document.querySelector('.total-article')
    let total_view = document.querySelector('.total-view')
    axios.all([
        axios.get("/getTotalArticleNumber"),
        axios.get("/getViewNum")
    ]).then(axios.spread( (res1,res2) => {
        total_article.innerHTML = res1.data.total_article.total_article
        total_view.innerHTML = res2.data.data.t
        let c = res2.data.data.g
        let cat = document.querySelector('.cat-con')
        for(let i=0;i<c.length;i++){
            let p = document.createElement('div')
            let l = document.createElement('div')
            l.setAttribute('class',"cat-list")
            l.innerHTML = c[i].category
            let s = document.createElement('span')
            s.setAttribute('class',"c_num")
            s.innerHTML = c[i].cnum + " 篇"
            p.appendChild(l)
            p.appendChild(s)
            cat.appendChild(p)

        }
        let category = document.querySelectorAll('.cat-list')
        return category
    } )).then(res => {
        for(let i=0;i<res.length;i++){
            res[i].addEventListener("click", () => {
                axios({
                    method:"get",
                    url:"/getArticleByCategory",
                    params:{
                        c:res[i].innerHTML,
                    }
                }).then(res => {
                    let data = res.data.r
                    let alln = document.querySelectorAll('.article-list')
                    let ae = document.querySelector('.article')
                    let next = document.querySelector('.next')
                    if(data.length <=10 ){
                        let yy= document.querySelector('.article h2')
                        if(yy){
                            yy.remove()
                        }
                        let t = document.createElement('h2')
                        t.innerHTML = data[0].category
                        ae.insertBefore(t,alln[0])
                        t.style.display = "inline-block"
                        let wt = t.offsetWidth
                        let at = ae.offsetWidth
                        t.style.marginLeft = `${(at/2)-(wt/2)}px`
                        for(let i=0;i<alln.length;i++){
                            alln[i].style.display = "block"
                        }
                        for(let i=alln.length-1;i>data.length-1;i--){
                            alln[i].style.display = "none"
                        }
                        for(let j=0;j<data.length;j++){
                   

                            addArticleNode(data,j)
                            next.style.display = "none"

                        }
                    }else{
                       
                        let yy= document.querySelector('.article h2')
                        if(yy){
                            yy.remove()
                        }
                        let t = document.createElement('h2')
                        t.innerHTML = data[0].category
                        ae.insertBefore(t,alln[0])
                        t.style.display = "inline-block"
                        let wt = t.offsetWidth
                        let at = ae.offsetWidth
                        t.style.marginLeft = `${(at/2)-(wt/2)}px`
                        for(let i=0;i<alln.length;i++){
                            if(i<10){
                                alln[i].style.display = "block"
                            }else{
                                alln[i].remove()
                            }
                            
                        }
                        for(let i=0; i<data.length; i++){
                            if(i<10){
                                addArticleNode(data,i)
                            }else{
                                let cnode= alln[0].cloneNode(true)
                                ae.appendChild(cnode)
                                addArticleNode(data,i)
                                next.style.display = "none"

                            }
                
                            
                        }
                    }

                }) 
            })
        }
    })
    let cundang = document.querySelector('.cd ul')
    let cd_date = document.querySelector('.cd ul :first-child a')
    axios({
        method:"get",
        url:"/getArticleDate"
    }).then(res => {
        r= res.data.t
        cd_date.innerHTML = r[0].date+" &nbsp<span>("+r[0].num+" 篇)</span>"
        for(let i=1;i<r.length;i++){
            let co_date = cd_date.cloneNode()
            co_date.innerHTML = r[i].date+" &nbsp<span>("+r[i].num+" 篇)</span>"
            let li = document.createElement('li')
            li.appendChild(co_date)
            cundang.appendChild(li)
        }
    }).then( res =>{
        let cud = document.querySelectorAll('.cd ul li')
        for(let i=0;i<cud.length;i++){
            cud[i].addEventListener('click', ()=> {
                axios({
                    method:"get",
                    url:"/getArticleByDate",
                    params:{
                        c:cud[i].innerText.split(" ")[0]
                    }
                }).then(res => {
                    let data = res.data.r
                    let alln = document.querySelectorAll('.article-list')
                    let ae = document.querySelector('.article')
                    let next = document.querySelector('.next')
                    if(data.length <=10 ){
                        let yy= document.querySelector('.article h2')
                        if(yy){
                            yy.remove()
                        }
                        let t = document.createElement('h2')
                        t.innerHTML = data[0].date
                        ae.insertBefore(t,alln[0])
                        t.style.display = "inline-block"
                        let wt = t.offsetWidth
                        let at = ae.offsetWidth
                        t.style.marginLeft = `${(at/2)-(wt/2)}px`
                        for(let i=0;i<alln.length;i++){
                            alln[i].style.display = "block"
                        }
                        for(let i=alln.length-1;i>data.length-1;i--){
                            alln[i].style.display = "none"
                        }
                        for(let j=0;j<data.length;j++){
                   

                            addArticleNode(data,j)
                            next.style.display = "none"

                        }
                    }else{
                       
                        let yy= document.querySelector('.article h2')
                        if(yy){
                            yy.remove()
                        }
                        let t = document.createElement('h2')
                        t.innerHTML = data[0].date
                        ae.insertBefore(t,alln[0])
                        t.style.display = "inline-block"
                        let wt = t.offsetWidth
                        let at = ae.offsetWidth
                        t.style.marginLeft = `${(at/2)-(wt/2)}px`
                        for(let i=0;i<alln.length;i++){
                            if(i<10){
                                alln[i].style.display = "block"
                            }else{
                                alln[i].remove()
                            }
                            
                        }
                        for(let i=0; i<data.length; i++){
                            if(i<10){
                                addArticleNode(data,i)
                            }else{
                                let cnode= alln[0].cloneNode(true)
                                ae.appendChild(cnode)
                                addArticleNode(data,i)
                                next.style.display = "none"

                            }
                
                            
                        }
                    }
                })
            })
        }
    })




    let search = document.querySelector('.search-button')
    let search_btn = document.querySelector('.search-icon img')
    search_btn.addEventListener('click', () => {
        let value = search.value
        axios({
            method:"post",
            url:"/search",
            data:{
                key:value
            }
        }).then(res=> {
            let alln = document.querySelectorAll('.article-list')
            let ae = document.querySelector('.article')
            let r = res.data.r
            if(r.length == 0){
                for(let i=0;i<alln.length;i++){
                    alln[i].style.display = "none"
                }
                let next = document.querySelector('.next')
                if(next){
                    next.style.display = "none"
                }
                let ct = document.querySelectorAll('.article h2')
                if(ct.length >0){
                    for(let i=0;i<ct.length;i++){
                        ct[i].remove()
                    }
                }
                let tip = document.createElement('h2')
                tip.innerHTML = "搜索不到内容！请更换关键词！"
                ae.appendChild(tip)
            }else if(r.length <=10){
                let next = document.querySelector('.next')
                if(next){
                    next.style.display = "none"
                }
               
                let h = document.querySelector('.article h2')
                if(h){
                    h.remove()
                }
                let t = document.createElement('h2')
                t.innerHTML = "搜索结果"
                ae.insertBefore(t,alln[0])
                t.style.display = "inline-block"
                let wt = t.offsetWidth
                let at = ae.offsetWidth
                t.style.marginLeft = `${(at/2)-(wt/2)}px`
                for(let i=0;i<alln.length;i++){
                    if(i<10){
                        alln[i].style.display = "block"
                    }else{
                        alln[i].remove()
                    }
                    
                }
                for(let i=alln.length-1;i>r.length-1;i--){
                    alln[i].style.display = "none"
                }
                for(let j=0;j<r.length;j++){
                   

                    addArticleNode(r,j)
                }
            }else{
                let next = document.querySelector('.next')
                if(next){
                    next.style.display = "none"
                }
               
                let h = document.querySelector('.article h2')
                if(h){
                    h.remove()
                }
                let t = document.createElement('h2')
                t.innerHTML = "搜索结果"
                ae.insertBefore(t,alln[0])
                t.style.display = "inline-block"
                let wt = t.offsetWidth
                let at = ae.offsetWidth
                t.style.marginLeft = `${(at/2)-(wt/2)}px`
                for(let i=0;i<alln.length;i++){
                    if(i<10){
                        alln[i].style.display = "block"
                    }else{
                        alln[i].remove()
                    }
                    
                }
                for(let i=0; i<r.length; i++){
                    if(i<10){
                        addArticleNode(r,i)
                    }else{
                        let cnode= alln[0].cloneNode(true)
                        ae.appendChild(cnode)
                        addArticleNode(r,i)
                        next.style.display = "none"

                    }
        
                    
                }
            }
        })
    })

})