const apiGetPostByUserId = `${api}posts/user/`
const apiLoadUserProfile = `${api}users/`

const framePost = $('.profile-body')

let currentPage = 0

let url = document.URL
let params = new URLSearchParams(url.split('?')[1])
let id = params.get('id')

window.addEventListener('load', function () {
    $('.header-account').style.display = 'flex'
    loadUser()
    loadUserProfile()
    loadPost(currentPage)
    checkTimeOut()
})


function loadUserProfile(){
    fetch(apiLoadUserProfile+id)
        .then(res => res.json())
        .then( data => {
            if(data.result){
                $('.profile-header__name').innerText = data.result.name
                if(data.result.img){
                    $('.profile-header__img-src').src = data.result.img
                }else{
                    $('.profile-header__img-src').src = '../assets/images/avatar.png'
                }
            }
        })
}

function loadUser() {
    let option = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('authToken')
        }
    }

    fetch(apiLoadUser, option)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                $('.header-account__username').innerText = data.result.name
                if (data.result.img) {
                    $('.header-account__img').src = data.result.img
                } else {
                    $('.header-account__img').src = '../assets/images/avatar.png'
                }
                loadPost(currentPage)
            }
            if(id===null){
                id = data.result.id
                console.log(id)
                loadUserProfile()   
                loadPost(currentPage)
            }else{
                $('.header-account__username').setAttribute('href','../pages/profile.html')
            }

        })
        .catch((error) => {
            console.log(error)
        })
}

function isScrollEnd() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight
}

window.addEventListener('scroll', () => {
    if (isScrollEnd()) {
        currentPage++
        loadPost(currentPage)
    }
})

function loadPost(page) {

    let params = {
        page,
        size: 4
    }

    let param = new URLSearchParams(params);

    fetch(`${apiGetPostByUserId}${id}?${param.toString()}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                data.result.content.forEach((post) => {
                    const postElement = document.createElement('div')
                    postElement.classList.add('post-body')
                    let urlPost = `./post-detail.html?id=${post.id}`

                    postElement.innerHTML = `
                            <div class="post-header">
                                <div class="post-header__user">
                                    <a class="post-header_user-link"><img src="${post.img_user || './assets/images/avatar.png'}" alt="" class="post-header__user-img"></a>
                                    <a class="post-header__user-name">${post.name}</a> 
                                    <a href="" class="post-header__user-datetime">${post.date_created}</a>
                                    <a href="" class="post-header__user-kind">${post.language}</a>
                                </div>
                                <div class="post-header__more">
                                    <button class="post-header__more-btn">
                                        <i class="fa-solid fa-ellipsis"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="post-title">
                                <a href="" class="post-title__text">${post.title}</a>
                            </div>
                            <div class="post-content">
                                <a href="" class="post-content__text"> ${post.content.replace(/\n/g, '<br>')} </a>
                            </div>
                           <div class="post-img" style="${post.img ? 'display: flex;' : 'display: none;'}">
                                <a href="" class="post-img__link"><img src="${post.img || ''}" style="${post.img ? 'display: flex;' : 'display: none;'}" class="post-img__link-src"></a>
                            </div>
                            <div class="post-interact">
                                <div class="post-interact__like">
                                    <button class="post-interact__like-btn">
                                        <i class="fa-regular fa-heart"></i>
                                        <span>${post.likes}</span>  
                                    </button>
                                </div>
                                <div class="post-interact__comment">
                                    <button class="post-interact__comment-btn">
                                        <i class="fa-regular fa-comment"></i>
                                        <span>${post.comments}</span>
                                    </button>
                                </div>
                                <div class="post-interact__share">
                                    <button class="post-interact__share-btn">
                                        <i class="fa-solid fa-share"></i>
                                        Share
                                    </button>
                                </div>
                        </div>
                    `
                    framePost.appendChild(postElement)
                    $('.post-header__user-datetime').setAttribute('href', urlPost)
                    $('.post-header__user-kind').setAttribute('href', urlPost)
                    $('.post-title__text').setAttribute('href', urlPost)  
                    $('.post-content__text').setAttribute('href', urlPost)
                    $('.post-img__link-src').setAttribute('href', urlPost)
                })
            }
        })
        .catch((error) => {
            console.log(error)
        })
}