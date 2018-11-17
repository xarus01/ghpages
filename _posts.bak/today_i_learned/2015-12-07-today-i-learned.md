---
layout: post
title:  "Today I learned - 12072015"
categories: Today_I_Learned
---

## Let's encrypt 와 nginx ssl 설정

[Let's encrypt](letsencrypt.org) 는 https 서버 구축과 인증을 더 간단하게 해주는 서비스이다. 퍼블릭 베타를 시작한 지 얼마 되지 않았으며, 공짜다. webRTC를 이용한 서비스를 개발하고 있는데 getUserMedia 를 이용하기 위해서는 https 커넥션을 통해서 서버 자원을 제공받아야 한다고 해서 써 보았다. [outsider 님의 글](http://blog.outsider.ne.kr/) 을 대부분 참고해서 설정 등을 하였다.

데모 시연를 위해서 내 개인 서버(ubuntu 12.04)에 설치를 하기로 결정했다.

    git clone https://github.com/letsencrypt/letsencrypt

github에서 소스를 다운로드 받은 후 letsencrypt 디렉토리로 들어간다.

    ./letsencrypt-auto

위의 명령어로 설치를 할 수 있다. --apache 나 --nginx와 같은 플러그인들이 있는데 인증서 발급과 설치를 자동으로 수행해준다고 한다. 하지만 nginx 플러그인은 문제가 많아서 현재로써는 지원을 하지 않고 있는 것 같다. 그래서 인증서 발급만 받은 후에 nginx 에서 설정을 해줬다.

+) [이 글](https://community.letsencrypt.org/t/how-to-get-an-a-rating-on-qualys-ssl-labs-with-nginx-without-breaking-loads-of-browsers/4582)을 참고하면 좀 더 쉽고 편리하게 할 수 있을것도 같다.

    ./letsencrypt-auto certonly --manual

위와 같이 인증서 발급을 수행할수 있다. 이메일과 도메인을 입력해주면 된다. (그리고 물론 서브 도메인은 DNS에 등록이 되어 있어야 한다.) 도메인에서 인증을 거쳐서 인증서 발급이 이루어지기 때문에 IP 정보가 기록될것이라는 안내가 나오고 **대기 상태가 된다.** URL 에서 key값을 제공하도록 만들지 않은 상태에서 부주의하게 엔터를 누르면 처음부터 다시 해야 하므로 주의.

기존에 사용하고 있는 서버가 있다면 디렉토리를 만들어서 key를 제공해도 되고 화면에 나타나는 python SimpleHTTPServer를 이용하는 방식을 사용해도 된다.

인증이 정상적으로 이루어졌다면 Congratulations! 으로 시작하는 안내문이 나타나고 /etc/letsencrypt/live/도메인명/ 에서 인증서를 찾을 수 있다. 서브도메인을 여러개 추가한 경우에는 가장 먼저 입력한 도메인명으로 디렉토리가 생성되는 것 같다.

기존 nginx 설정에서 주석 처리되어 있던 https 관련 설정을 그대로 사용했다. 아래의 줄들만 추가해줬다.

    ssl_certificate /etc/letsencrypt/live/monocuration.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/monocuration.com/privkey.pem;
    ssl_dhparam /etc/letsencrypt/live/monocuration.com/dhparam.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/monocuration.com/chain.pem;
     
    resolver 8.8.8.8 8.8.4.4 valid=86400;
    resolver_timeout 10;

dhparam.pem 파일은 아래 명령어로 생성했다.

    openssl dhparam -out dhparam.pem 2048

잘 된다. 다만 인증서를 직접 발급받았기 때문에 letsencrypt가 관리를 해 주지 못하므로 90일마다 직접 갱신을 해야 한다는 문제가 있다. 당장 급하게 쓸 목적으로 설치를 한 것이니 충분히 만족스럽다.

## Sublime Text 3 Package Control

원래는 마크다운 문서를 작성할 일이 많지 않아서 온라인 에디터를 사용했는데, TIL 을 기록하기로 마음먹으면서 Sublime Text 를 3으로 바꾸고 마크다운 플러그인을 깔기로 결정했다. Sublime Text 의 플러그인은 직접 설치할수도 있지만 [Package Control](https://packagecontrol.io/installation) 이라는 플러그인을 설치하면 관리가 더 용이하다.

    import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)

Sublime Text 3 를 기준으로 View -> Show Console 을 클릭한 후 위의 코드를 붙여넣으면 된다. hash 값이 바뀔 수 있기 때문에 [공식 웹사이트](https://packagecontrol.io/installation) 의 코드를 사용하는것이 바람직하다.

설치를 한 후에는 Sublime Text 를 껐다 켜서 Tools -> Command Palette을 선택한 후 install 을 입력한다. Package Control: Install Package 가 실행되면 마크다운 플러그인 (내 경우에는 MarkdownEditing) 의 이름으로 검색하고 선택을 하면 된다. 껐다 켜면 마크다운 파일에 대해서 플러그인의 스타일이 자동으로 적용되어 있음을 알 수 있다.

## Socket.io on ssl

예의 webRTC 서비스 데모를 테스트 하는 과정에서 iOS 디바이스에서는 웹소켓이 동작하지 않는 것을 알게 되었다. 이전에는 없었던 일이라, 왜 그런지 조사해보았더니 [Stackoverflow](http://stackoverflow.com/questions/30894453/nodejs-socket-io-working-on-desktop-safari-chrome-but-not-iphone)에 나와 같은 사례가 있었다. iOS에서는 SSL 커넥션으로 웹소켓 통신이 불가능하다고 한다. 소켓 서버를 http 서버로 떼어 내야 하는데 [simpleWebRTC](https://github.com/andyet/SimpleWebRTC) 의 경우 xhr 을 이용해서 웹소켓 연결을 확인한 후 실제 웹소켓 연결을 생성한다. 이때 https로 제공되는 페이지 내에서 이루어지는 xhr 인 만큼 https를 통해서 제공되어야 한다. 소스코드를 고칠 시간이다.
