const express = require("express")
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const path = require('path')
const ejs = require('ejs')

const app = express()
const cors = require('cors')
const { resolve } = require("path")
const { realpath } = require("fs")
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const secretkey = "hello world*_*"

const db = mysql.createPool({
    host:'127.0.0.1',
    //宝塔数据库
    user:'root1',
    //本地数据库
    //user:"root",
    password:'root',
    database:'blog'
})
app.set('view engine', 'ejs')
app.engine('html', ejs.__express)
app.set('engine', 'html')


app.get('/getAllMessage', (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`select content,date_format(comment.create_time,"%Y-%m-%d") date, user.username username from comment join user on comment.user_id=user.user_id order by date desc`, (err,result) =>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        return res.send({status:1,message:value})
    },reason => {
        return res.send({status:0,message:reason})
    })
})

app.post('/addMessage', (req,res) => {
    if(Number(req.body.message != 0)){
        let data = req.body.token.split(' ')
        jwt.verify(data[1],secretkey,(err,r) => {
            if(err){
                return res.send({status:0,message:"验证错误或token过期"})
            }else{
                new Promise((resolve,reject) => {
                    db.query(`select user_id from user where username = "${r.username}"`,(err,result) => {
                        if(err){
                            reject(err.code)
                        }else{
                            resolve(result)
                        }
                    })
                }).then(value => {
                    db.query(`insert into comment(content,create_time,user_id) values("${req.body.message}",now(),${value[0].user_id})`, (err,result) => {
                        if(!err){
                            return res.send({status:1})
                        }else{
                            return res.send(err)
                        }
                    })
                }, reason => {
                    return res.send({status:2,message:reason})
                })
            }
        })
    }
    
})

app.get("/getArticleByDate", (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`select article_id,article_name,article_desc,category,view_num,date_format(create_time,"%Y") date from article where date_format(create_time,"%Y") =${req.query["c"]} order by date desc`, (err,result) => {
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        return res.send({status:1,r:value})
    },reason =>{
        return res.send({statu:0,message:reason})
    })
})
app.get('/getArticleDate', (req,res) => {
    new Promise((resolve,reject) =>{
        db.query(`select distinct date_format(create_time,"%Y") date,count(*) num from article group by date order by date desc`, (err,result) => {
            if(err){
                reject(err.code)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        return res.send({status:1,t:value})
    },reason => {
        return res.send({status:0,message:reason})
    })
})
app.get('/getArticleByCategory', (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`select article_id,article_name,article_desc,category,view_num,date_format(create_time,"%Y-%m-%d") time from article where category="${req.query['c']}" order by time desc`, (err,result) => {
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        return res.send({status:1,r:value})
    },reason => {
        return res.send({status:0,message:reason})
    })
})
app.post("/search", (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`select article_id,article_name,article_desc,category,view_num,date_format(create_time,"%Y-%m-%d") time from article where article_name like "%${req.body.key}%" order by create_time desc` ,(err,result) => {
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
       return res.send({status:1,r:value})
    },reason => {
        return res.send({status:0,message:reason})
    })
})
app.get('/getViewNum', (req,res) => {
    new Promise((resolve,reject) => {
        db.query('select sum(view_num) viewnum from article ', (err,result) => {
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        }) 
    }).then(value => {
        return new Promise((resolve,reject) => {
            db.query("select category,count(category) cnum  from article where is_delete =0 group by category order by cnum desc", (err,result) => {
                if(err){
                    reject(err)
                }else{

                    let h = {
                        t:value[0].viewnum,
                        g:result
                    }
                    resolve(h)
                }
            })
        })
    }).then(value => {
        return res.send({status:1,data:value})
    })

})
app.get('/article/:article_id', (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`select article_name,article_content from article where article_id = ${req.params.article_id}`, (err,result) => {
            if(err){
                reject(err.code)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        db.query(`select view_num from article where article_id=${req.params.article_id}`, (err,result) => {
            if(!err) {
                let a = result[0].view_num
                a = a + 1
                db.query(`update article set view_num = ${a} where article_id=${req.params.article_id}`, (err,result) => {
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
        res.render('article.html',{data:{name:value[0].article_name,content:value[0].article_content}})
        // return res.send({status:1,article_content:value[0]})
    },reason => {
        return res.send({status:0,message:reason})
    })
})
app.get('/getTotalArticleNumber', (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`select count(article_name) total_article from article`, (err,result) => {
            if(err){
                reject(err.code)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        return res.send({status:1,total_article:value[0]})
    },reason => {
        return res.send({status:0,message:reason})
    })
})

app.get("/getArticleByPage", (req,res) => {
    let d = Number(req.query.page)
    new Promise((resolve,reject) => {
        db.query(`select article_id,article_name,article_desc,category,view_num,date_format(create_time,"%Y-%m-%d") time from article where is_delete =0 order by time desc limit ?,?`,[(d-1)*10,10], (err,result) => {
            if(err){
                reject(err.code)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        return res.send({status:1,article:value,page:req.query.page})
    },reason => {
        return res.send({status:0,message:reason})
    })
})
app.get("/deleteArticle", (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`update article set is_delete=1 where article_id=${req.query.article_id}`, (err,result) => {
            if(err){
                reject(err.code)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        return res.send({status:1,message:"删除成功"})
    },reason => {
        return res.send({status:0,message:reason})
    })
})
app.post('/updateArticle', (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`update article set article_name="${req.body.article_name}",article_content='${req.body.article_content}',article_desc="${req.body.article_desc}",category="${req.body.category}" where article_id=${req.body.article_id}` ,(err,result) => {
            if(err){
                reject(err.code)
            }else{
                resolve(result)
            }
        })
    }).then(value => {
        return res.send({status:1,message:"修改成功"})
    },reason => {
        return res.send({status:0,message:"修改失败"})
    })
})
app.get('/getSingleArticle', (req,res) => {
    new Promise((resolve,reject) => {
        db.query(`select article_id,article_name,article_content,article_desc,category from article where article_id = "${req.query.article_id}"` , (err,result) => {
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    }).then(value=>{
        
        return res.send(value[0])
    },reason => {
        return res.send({status:0,message:"请求失败"})
    })
})
app.get('/getAllarticleName', (req,res)=>{
    new Promise((resolve,reject) => {
        db.query(`select article_id,article_name from article where is_delete =0 order by create_time desc`, (err,result) =>{
            if(err){
                reject(err.code)
            }else{
                resolve(result)
            }
        })
    }).then(value=>{
        if(value.length > 0){
            return res.send({status:1,data:value})
        }else{
            return res.send({status:0,message:"请求数据失败"})
        }
    })
})

app.post('/addarticle',(req,res) => {
    let data = req.body.token.split(' ')
    jwt.verify(data[1],secretkey,(err,r) => {
        if(err){
            return res.send({status:0,message:"验证错误或token过期"})
        }else{
            new Promise((resolve,reject) => {
                db.query(`select user_id from user where username ="${r.username}"`,(err,result) => {
                    if(err){
                        reject(err.code)
                    }else{
                        resolve(result)
                    }
                })
            }).then(value => {
                return new Promise((resolve,reject) => {
                    db.query(`insert into article(article_name,article_content,article_desc,category,create_time,user_id,is_delete) values("${req.body.title}",'${req.body.html}',"${req.body.desc}","${req.body.category}",now(),"${value[0].user_id}","0")`, (err,result) => {
                        if(err){
                            reject(err)
                        }else{
                            resolve(result)
                        }
                    })
                })
            }).then(value=>{
                if(value.affectedRows == 1){
                    return res.send({status:1,message:"提交成功"})
                }else{
                    return res.send({status:2,message:"提交失败"})
                }
            },reason => {
                return res.send({status:2,message:reason})
            })
        }
    })
})
app.post('/verifyadmin', (req,res) => {
    let data = req.body.token.split(' ')
    jwt.verify(data[1],secretkey,(err,r) => {
        if(err){
            return res.send({status:0,message:"验证错误或token过期"})
        }else{
            new Promise((resolve,reject) => {
                db.query(`select isadmin from user where username ="${r.username}"`,(err,result) => {
                    if(err){
                        reject(err.code)
                    }else{
                        resolve(result)
                    }
                })
            }).then(value => {
                if(value[0].isadmin == 0){
                    return res.send({status:0,message:"非管理员账户"})
                }else{
                    return res.send({status:1,message:"管理员账户"})
                }
            }, reason => {
                return res.send({status:2,message:reason})
            })
        }
    })
})

app.post('/verifytoken', (req,res) => {
    let data = req.body.token.split(' ')

   jwt.verify(data[1],secretkey,(err,r) => {
        if(err){
            return res.send({status:0,message:"验证错误或token过期"})
        }else{
            return res.send({status:1,username:r.username})
        }
    })
})
app.post('/signin', (req,res) => {
    if(Number(req.body.username) ==0 || Number(req.body.password) == 0){
        return res.send({status:0})
    }
    new Promise((resolve,reject) => {
        db.query(`select username from user where username = "${req.body.username}"`, (err,result) => {
            if(err){
                reject(err.code)
            }else{
                if(result.length > 0){
                    return res.send({status:2})
                }else{
                    resolve(result)
                }
            }
        })
    }).then(value => {
        db.query(`insert into user (username,password,isadmin,isdelete,create_time) values("${req.body.username}","${req.body.password}","0","0",now())`, (err,result) => {
            if(err){
                return Promise.reject(err.code)
            }else{
                if(result.affectedRows == 1){
                    let token = jwt.sign({ username: req.body.username }, secretkey, { expiresIn: '100h' })
                    return res.send({status:1,token:token})
                }
            }
        })
    },reason => {
        return res.send({message:reason})
    })
})
app.post('/login', (req,res) => {
    if(Number(req.body.username) ==0 || Number(req.body.password) == 0){
        return res.send({status:0})
    }
    new Promise((resolve,reject) => {
        db.query(`select username from user where username = '${req.body.username}' and password = '${req.body.password}' `, (err,result) => {
            if(err){
                reject(err.code)
            }else{
                if(result.length > 0){
                    resolve(result)
                }else{
                    reject('未找到用户')
                }
                    
            }
        })
    }).then(value => {
        let token = jwt.sign({ username: value[0].username }, secretkey, { expiresIn: '100000h' })
        return res.send({status:1,token:token})
    },reason => {
        return res.send({status:2,message:reason})
    })
})




app.use('/css',express.static('./css'))
app.use('/images',express.static('./images'))
app.use('/js',express.static('./js'))
app.use(express.static('./article'))
app.use(express.static('./html'))
app.listen(8000, () => {
    console.log('port 8000 run')
})