import {jwtDecode} from "jwt-decode";
import {useEffect, useState} from "react";
import reactLogo from '../assets/react.svg'


export default function Index() {
    function handleClose1() {
        window.open('https://back.fgacyc.com/', "_self")
    }

    function extractTokenAndLanguage(url) {
        let regex = /token=([^&]+).*?&language=([^&]+)/;
        let match = url.match(regex);
        if (match) {
            let token = match[1];
            let language = match[2];
            return { token: token, language: language };
        } else {
            return { token: null, language: null };
        }
    }

    const [url, setUrl] = useState('');
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('');

    useEffect(() => {
        const currentUrl = window.location.href;
        setUrl(currentUrl);
        const { token, language } = extractTokenAndLanguage(currentUrl);
        if (!token) return;
        setToken(token);

        if (language) {
            setLanguage(language);
        }else {
            setLanguage('en');
        }


        try {
            // console.log(token)
            const decodedData = jwtDecode(token) ;
            setDecoded(decodedData);
        } catch (error) {
            setError(error);
            // console.error(error);
        }


    }, []);


    useEffect(() => {
        async function getUserInfo() {
            const domain = decoded.aud[1];
            const response = await fetch(domain, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUserInfo(data);
        }
        if (decoded) {
            getUserInfo();
        }
    }, [decoded]);

    const handleShare = () => {
        console.log("Native calling share");
        if (!window.flutter_inappwebview) return;
        window.flutter_inappwebview
            .callHandler("share", "Hello I am a sharing content", "https://www.google.com/")
            .then((result) => {
                console.log(result);
            });
    };

    const handleShareImage = () => {
        console.log("Native calling share");
        if (!window.flutter_inappwebview) return;
        window.flutter_inappwebview
            .callHandler("share", "This is an image", "https://cms.fgacyc.com/uploads/large_fahuizhichangyingxiangli_1b780283db.jpeg")
            .then((result) => {
                console.log(result);
            });
    };

    return (
        <div className={"h-screen flex flex-col justify-center items-center overflow-y-hidden"}>
            <div className={"h-screen w-screen overflow-y-auto flex flex-col items-center"}>
                <div>
                    <a href="#" target="_blank">
                        <img src={reactLogo} className="logo react " alt="React logo"/>
                    </a>
                </div>
                <h1>Webview Tools</h1>
                <div className={"limit-width mt-6"}>
                    {
                        userInfo ? (
                                <div className={"w-full flex flex-col items-center"}>
                                    <h2>User Info</h2>
                                    <img src={userInfo.picture} alt="User Picture" style={{
                                        borderRadius: '50%',
                                        width: '100px',
                                        height: '100px',
                                    }}
                                    />
                                    <p>Name: {userInfo.name}</p>
                                    <p>First Name: {userInfo.given_name}</p>
                                    <p>Last Name: {userInfo.family_name}</p>
                                    <p>Email: {userInfo.email}</p>
                                    <p>Sub: {userInfo.sub}</p>
                                </div>
                            ) :
                            <p>Loading...</p>
                    }
                </div>
                {
                    error && (
                        <div className={"limit-width"}>
                            <h2>Error</h2>
                            <p>{error.message}</p>
                        </div>
                    )
                }

                <div>
                    <div className={"title"}>TOKEN</div>
                    <textarea defaultValue={token} rows={8} className={"text-area"}></textarea>
                </div>

                <div>
                    <div className={"title"}>TOKEN + LANG</div>
                    <textarea value={`/?token=${token}&language=${language}`} rows={8}
                              className={"text-area"}></textarea>
                </div>

                <div>
                    <div className={"title"}>URL</div>
                    <div className={"limit-width"}>
                        {url}
                    </div>
                </div>


                <div>
                    <div className={"title"}>JWT</div>
                    <div className={"limit-width json-display"}>
                        {JSON.stringify(decoded, null, 4)}
                    </div>
                </div>

                <div>
                    <div className={"title"}>User Info</div>
                    <div className={"limit-width json-display"}>
                        {JSON.stringify(userInfo, null, 4)}
                    </div>
                </div>


                <div>
                    <div className={"title"}>Language</div>
                    <div className={"limit-width"}>
                        {language}
                    </div>
                </div>

                <div className="card">
                    {/*<div>*/}
                    {/*    <button onClick={handleClick}>*/}
                    {/*        Close the webview(/back)*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    <div style={{
                        marginTop: '30px',
                        color: 'white',
                    }}>
                        <button onClick={handleClose1}>
                            Close the webview
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div style={{
                        marginTop: '30px',
                        color: 'white',
                    }}>
                        <button onClick={handleShare}>
                            Share Content
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div style={{
                        marginTop: '30px',
                        color: 'white',
                    }}>
                        <button onClick={handleShareImage}>
                            Share Image
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}