function stopscroll() {
    window.onscroll = () => {
        let t = document.querySelector('html').scrollTop    
        if (t>0) {
            window.scrollTo(0,0)
        }
    }
}
function keepscroll() {
    window.onscroll = () => {

    }
}
function addArticleNode(data,num){
    let a = data.article
    let category = document.querySelectorAll('.category')
    // let ad = document.querySelectorAll('.article-date')
    let h3 = document.querySelectorAll('.title h3')
    let title = document.querySelectorAll('.title')
    let desc = document.querySelectorAll('.desc span')
    category[num].innerHTML =">"+ a[num].category
    let ad = document.createElement("span")
    ad.setAttribute("class","article-data")
    category[num].appendChild(ad)
    ad.innerHTML = a[num].time
    h3[num].innerHTML = a[num].article_name
    let a_link = document.createElement('a')
    a_link.setAttribute("href",`/article/${a[num].article_id}`)
    a_link.appendChild(h3[num])
    title[num].appendChild(a_link)
    desc[num].innerHTML = a[num].article_desc
    let yd = document.querySelectorAll('.b-right a')
    yd[num].setAttribute("href",`/article/${a[num].article_id}`)

    
}

window.addEventListener('load', () => {
    //获得首页文章信息
    axios({
        method:"get",
        url:"/getArticleByPage",
        params:{
            page:1
        }
    }).then(res=>{
        let d = res.data
        if(d.status ==1){
            let alln = document.querySelectorAll('.article-list')
            let ae = document.querySelector('.article')
            ae.setAttribute("page",d.page)
            for(i=0;i<alln.length;i++){
                addArticleNode(d,i)
            }
            

        }else{
            alert('获取文章列表失败')
        }
    })
   


    let t = window.localStorage.getItem('Authorization')
    if(t) {
        axios({
            
            method:"POST",
            url:"/verifytoken",
            data:{
                token:t
            }
        }).then(res => {
            if(res.status ==0 ){
                console.log("验证失败或token过期")
            }else{
                let u = res.data.username
                let d= document.querySelector('.btn-lgsin')
                let l = document.querySelector('.logout')
                d.innerText = u
                d.style.pointerEvents = "none"
            }
        })
    }
    let btn = document.querySelectorAll('.btn')
    btn[0].addEventListener('mousedown', () => {
        btn[0].style.backgroundColor = "lightblue"
        btn[0].style.color = "orange"
    })
    btn[0].addEventListener('mouseup', () => {
        btn[0].style.backgroundColor = "bisque"
        btn[0].style.color = "black"
    })
    btn[1].addEventListener('mousedown', () => {
        btn[1].style.backgroundColor = "lightblue"
        btn[1].style.color = "orange"
    })
    btn[1].addEventListener('mouseup', () => {
        btn[1].style.backgroundColor = "bisque"
        btn[1].style.color = "black"
    })
    btn[0].addEventListener('click', () => {
        let username = document.querySelector('#username')
        let password = document.querySelector('#password')
        let data = {
            username:username.value,
            password:password.value
        }
        let k = document.querySelector('.dl :nth-child(2)')
        let v = document.querySelector('.dl :nth-child(3)')
        axios({
            method:"POST",
            url:"/login",
            data:data
        }).then(res => {
            let response = res.data.status;
            switch(response){
                case 0:
                    v.style.display = "none"
                    k.style.display = "inline-block"
                    break;
                case 1:
                    let token = res.data.token
                    window.localStorage.setItem('Authorization', "Bearer " + token)
                    window.location = '/index.html'
                    break;
                case 2:
                    k.style.display = "none"
                    v.style.display = "inline-block"
            }
        })
    })
    btn[1].addEventListener('click', () => {
        let username = document.querySelector('#username_zc')
        let password = document.querySelector('#password_zc')
        let data = {
            username:username.value,
            password:password.value
        }
        let k = document.querySelector('.si :nth-child(2)')
        let v = document.querySelector('.si :nth-child(3)')
        let n = document.querySelector('.si :nth-child(4)')
        axios({
            method:"POST",
            url:"/signin",
            data:data
        }).then(res => {
            let response = res.data.status;
            switch(response){
                case 0:
                    v.style.display = "none"
                    k.style.display = "inline-block"
                    break;
                case 1:
                    let token = res.data.token
                    window.localStorage.setItem('Authorization', "Bearer " + token)
                    window.location = '/index.html'
                    break;
                case 2:
                    k.style.display = "none"
                    n.style.display = "inline-block"
            }
        })
    })
    let btn1 = document.querySelector('.btn-lgsin')
    btn1.addEventListener('click', () => {
        let mt = document.querySelector('.dl')
        let close = document.querySelector('.close')
        let closel = document.querySelector('.closel')
        let shadow = document.querySelector('.shadow')
        let s = document.querySelector('.tip span a')
        let si = document.querySelector('.si')
        mt.style.display = "block"
        shadow.style.display = "block"
        stopscroll()
        close.addEventListener('click', () => {
            mt.style.display = "none"
            shadow.style.display = "none"
            keepscroll()
        })
        s.addEventListener('click', () => {
            mt.style.display = "none"
            si.style.display = "block"
            closel.addEventListener('click', () => {
                shadow.style.display = "none"
                si.style.display="none"
                keepscroll()
            })

        })


    })

    let scrolltop = document.querySelector('.scrollto_top')
    let top = document.querySelector('html').scrollTop
    if(top <=10){
        scrolltop.style.display = "none"
    }
    window.onscroll = () => {
        let t = document.querySelector('html').scrollTop 
        if(t <= 10){
            scrolltop.style.display = "none"
        }else{
            scrolltop.style.display = "block"
        }
    scrolltop.addEventListener('click', () => {
        window.scrollTo({ 
            top: document.body.scrollTop, 
            behavior: "smooth"
        })
    })
}



})

