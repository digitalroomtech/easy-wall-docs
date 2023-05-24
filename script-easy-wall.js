const contentNoteId = 'content_note'; // <div id='content_note'>...</div> tag content
const headerId = 'content-profile'; // <div id='content-profile'>...</div> tag content profile
const typeNoteId = 'type-note';// <div id='type-note' data-id='$product'>...</div> tag content profile
const numberOfAttempts = 10;
const urlClient = ''; // [external form]
const urlServer = '';// [url server]
const urlAllowed = ''; //[ allowed url 1, allowed url 2];

const setCookie = (name, value, expiredDays) => {
    const d = new Date();
    d.setTime(d.getTime() + (expiredDays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
};

const getCookie = (cname) => {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};

const isPayNote = () => {
    const elem = document.getElementById(typeNoteId);
    if (elem) {
        const value = elem.getAttribute('data-id');
        return value === 'exclusivos';
    }
    return false;
};

const isFreeNote = () => {
    const elem = document.getElementById(typeNoteId);
    return !elem
};

const getAllParams = () => {
    const params = new URLSearchParams(decodeURI(document.location.search).replace('%3D', '='));

    return {
        action: params.has('action') ? params.get('action') : 'register',
        password_reset_token: params.has('password_reset_token') ? params.get('password_reset_token') : '',
        access_token: params.has('access_token') ? params.get('access_token') : '',
        current_url: window.location.href,
        form: params.has('form') ? params.get('form') : '',
        email: params.has('email') ? params.get('email') : '',

    };
};

const getToken = () => {
    const params = getAllParams();
    let token = getCookie('_vu');
    if (params.access_token && !token) {
        setCookie('_vu', params.access_token, 30);
        token = params.access_token;
    }

    return token;
};

const getAttempts = () => {

    const attempts = getCookie('attempts');

    if (typeof attempts === 'string' && attempts === '') return 0;

    if (typeof attempts === 'string' && attempts) return parseInt(attempts);

    return parseInt(attempts);
};

const deleteCookie = (name) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
};

const generateIFrameUrl = (variables = undefined) => {
    let params = getAllParams();

    if (variables && typeof variables === 'object') {
        params = {
            ...params,
            ...variables,
        };
    }

    console.log('params', params);
    const search = Object.keys(params).map((key, index) => index ? `&${key}=${params[key]}` : `${key}=${params[key]}`);

    return `${urlClient}?${search.join('').toString()}`;
};

const renderIFrame = (url) => {
    return `<iframe src='${url}' height='650px' style='width: 100%'></iframe>`;
};

const renderContentNote = (url = '') => {
    return `
    <div style='background: linear-gradient(rgba(255, 255, 255, 0), rgb(255, 255, 255));height: 250px;position:relative;margin-top: -250px'></div>
    ${renderIFrame(url)}
    `;
};

const receiveMessage = (event) => {
    const arrayUrlAllowed = urlAllowed.split(',');
    if (event && event.data && event.data.access_token && event.origin && arrayUrlAllowed.includes(event.origin)) {
        setCookie('_vu', event.data.access_token, 30);
        window.location.reload();
    }

    if (event && event.data && event.data.facebookUrl && event.origin && arrayUrlAllowed.includes(event.origin)) {
        window.location.href = event.data.facebookUrl;
    }
};

const fetchUser = async () => {
    const token = getToken();
    return await fetch(urlServer, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `query {user{
                    id
                    email
                    avatar
                    name
                    }
                }`,
        }),
    });
};

const renderModalStyle = () => {
    return `
        <style>
        /* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: #fff; /* Fallback color */
}

/* Modal Content/Box */
.modal-content {
  padding: 10px 20px;
  border: 1px solid rgba(0,0,0,.2);
  width: 100%; /* Could be more or less, depending on screen size */

}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
@media (min-width: 576px){

.modal-content  {
    max-width: 500px!important;
    margin: 1.75rem auto;
}
 }</style>
    `;
};

const renderUserProfileStyle = () => {
    return `
        <style>

            .btn-close:focus {
    box-shadow: none !important;
}

        .position-relative{
            position: relative;
        }

            .dropdown {
    display: none;
    padding: 0.5rem;
    margin-right: 10px;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 0.25rem;
    min-width: 10rem;
    position: absolute;
    right: 0

}
    .dropdown > li > a {
    color: black !important;
    text-decoration: none;
}

</style>

    `;
};
const renderModal = (url = '') => {
    return `
        ${renderModalStyle()}
        <div>
           <div style='font-weight: bold; text-decoration: underline; cursor: pointer' id='easy-wall-open-modal'>Iniciar sesión</div>
            <div id='easy-wall-modal' class='modal'>

                <div class='modal-content'>
                <div style='display: flex;justify-content: end'>
                                <span id='easy-wall-close' class='close'>&times;</span>
                </div>
               ${renderIFrame(url)}
                </div>
            </div>
        </div>
    `;
};

const renderUserProfile = async () => {
    const response = await fetchUser();
    const {data} = await response.json();

    return `
        ${renderUserProfileStyle()}
    <div id='easy-wall-profile' class='position-relative'>
       <img id='user-profile' src='${data && data.user && data.user.avatar ? data.user.avatar : 'https://vanguardia.com.mx/base-portlet/webrsrc/theme/7ca1f8da04547061f7040fdf168dd01f.png'}' class='rounded-circle' style='width: 25px;position:relative; bottom: 2px; left: 5px' alt='Avatar' />
    <ul id='dropdown' class='dropdown'>
        <li><div class='dropdown-item'>${decodeURI(data.user.name) ?? data.user.email}</div></li>
        <li><div class='dropdown-item' id='easy-wall-logout'>Cerrar sesión</div></li>
    </ul>
    </div>
    `;
};

const logout = () => {
    deleteCookie('_vu');
    const urlObj = new URL(window.location.href);
    urlObj.search = '';
    return window.location.href = urlObj.toString();
};

const renderInHeader = async () => {
    const token = getToken();
    const elem = document.getElementById(headerId);
    const params = getAllParams();
    if (!elem) return '';

    if (!token) {
        elem.innerHTML = renderModal(generateIFrameUrl({form: 'HEADER'}));

        const modal = document.getElementById('easy-wall-modal');

        const btn = document.getElementById('easy-wall-open-modal');

        const close = document.getElementById('easy-wall-close');

        btn.onclick = function () {
            modal.style.display = 'block';
        };

        close.onclick = function () {
            modal.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
        return params.form && params.form === 'HEADER' ? modal.style.display = 'block' : '';
    }

    elem.innerHTML = await renderUserProfile();

    const userProfile = document.getElementById('user-profile');

    const dropdown = document.getElementById('dropdown');

    const close = document.getElementsByClassName('dropdown-item')[1];

    userProfile.onclick = function () {
        if (dropdown.style.display === 'none') {
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    };

    close.onclick = function () {
        logout();
    };

    document.onclick = function (event) {

        if (event.target !== userProfile) {
            dropdown.style.display = 'none';
        }
    };

    return '';

};

const renderInContent = () => {
    const elem = document.getElementById(contentNoteId);
    const token = getToken();
    const isPay = isPayNote();
    const isFree = isFreeNote();
    const attempts = getAttempts();

    if (!elem) return '';

    // First step: check if token already exists
    if (token) {
        return elem.style.visibility = 'visible';
    }

    if (isFree) {
        elem.style.visibility = 'visible';
        return elem.innerHTML = renderContentNote(generateIFrameUrl());
    }

    // Second step: check if note is exclusive
    if (isPay) {
        elem.style.visibility = 'visible';
        return elem.innerHTML = renderContentNote(generateIFrameUrl());
    }

    // Third step: Check if attempts is greater to max number of attempts
    if (attempts < numberOfAttempts) {
        setCookie('attempts', attempts + 1, 1);
        return elem.style.visibility = 'visible';
    }

    elem.style.visibility = 'visible';
    return elem.innerHTML = renderContentNote(generateIFrameUrl());

};


document.addEventListener('DOMContentLoaded', async () => {
    if (!urlClient) throw Error('La url de easy wall es requerida');
    if (!urlAllowed) throw Error('La lista de dominios es requerida');

    window.addEventListener('message', receiveMessage, false);

    renderInContent();
    await renderInHeader();
});
