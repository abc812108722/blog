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


window.addEventListener('load', () => {


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
    axios({
        method:"get",
        url:"/getAllMessage"
    }).then( res => {
        let m = document.querySelector('.message')
        let r = res.data.message
        let d = document.querySelector('.d')
        for(let i=0;i<r.length;i++){
            let e = d.cloneNode(true)
            e.setAttribute("class","e")
            let time = e.querySelector('.time')
            let n = e.querySelector('.n')
            time.innerHTML = r[i].date
            n.innerHTML = r[i].username
            let text = document.createTextNode(r[i].content)
            e.insertBefore(text,time)
            m.appendChild(e)
        }
    })

    let mbtn = document.querySelector('.box button')
    mbtn.addEventListener('click', () => {
        let message = document.querySelector('.t').value
        if(Number(t) == 0){
            alert('尚未登录')
        }else if(Number(message) == 0 ){
            alert("请输入内容")
        }else{
            axios({
                method:"post",
                url:"/addMessage",
                data:{
                    token:t,
                    message:message
                }
            }).then(res => {
                if(res.data.status ==1){
                    location.reload()
                }
            })
        }
        
    })




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

