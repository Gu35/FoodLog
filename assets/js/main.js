/*
    Phantom by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var $window = $(window),
        $body = $('body');

    // Breakpoints.
    breakpoints({
        xlarge:    [ '1281px',  '1680px' ],
        large:     [ '981px',   '1280px' ],
        medium:    [ '737px',   '980px'  ],
        small:     [ '481px',   '736px'  ],
        xsmall:    [ '361px',   '480px'  ],
        xxsmall:   [ null,      '360px'  ]
    });

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Touch?
    if (browser.mobile)
        $body.addClass('is-touch');

    // Forms.
    var $form = $('form');

    // Auto-resizing textareas.
    $form.find('textarea').each(function() {
        var $this = $(this),
            $wrapper = $('<div class="textarea-wrapper"></div>'); // $submits 변수는 사용되지 않아 제거했습니다.

        $this
            .wrap($wrapper)
            .attr('rows', 1)
            .css('overflow', 'hidden')
            .css('resize', 'none')
            .on('keydown', function(event) {
                if (event.keyCode == 13 && event.ctrlKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).blur();
                }
            })
            .on('blur focus', function() {
                $this.val($.trim($this.val()));
            })
            .on('input blur focus --init', function() {
                $wrapper
                    .css('height', $this.height());
                $this
                    .css('height', 'auto')
                    .css('height', $this.prop('scrollHeight') + 'px');
            })
            .on('keyup', function(event) {
                if (event.keyCode == 9)
                    $this.select();
            })
            .triggerHandler('--init');

        // Fix.
        if (browser.name == 'ie' || browser.mobile)
            $this
                .css('max-height', '10em')
                .css('overflow-y', 'auto');
    });

    // Menu.
    var $menu = $('#menu');

    $menu.wrapInner('<div class="inner"></div>');

    $menu._locked = false;

    $menu._lock = function() {
        if ($menu._locked)
            return false;
        $menu._locked = true;
        window.setTimeout(function() {
            $menu._locked = false;
        }, 350);
        return true;
    };

    $menu._show = function() {
        if ($menu._lock())
            $body.addClass('is-menu-visible');
    };

    $menu._hide = function() {
        if ($menu._lock())
            $body.removeClass('is-menu-visible');
    };

    $menu._toggle = function() {
        if ($menu._lock())
            $body.toggleClass('is-menu-visible');
    };

    $menu
        .appendTo($body)
        .on('click', function(event) {
            event.stopPropagation();
        })
        .on('click', 'a', function(event) {
            var href = $(this).attr('href');
            event.preventDefault();
            event.stopPropagation();

            // Hide.
            $menu._hide();

            // Redirect.
            if (href == '#menu')
                return;
            window.setTimeout(function() {
                window.location.href = href;
            }, 350);
        })
        .append('<a class="close" href="#menu">Close</a>');

    $body
        .on('click', 'a[href="#menu"]', function(event) {
            event.stopPropagation();
            event.preventDefault();

            // Toggle.
            $menu._toggle();
        })
        .on('click', function(event) {
            // Hide.
            $menu._hide();
        })
        .on('keydown', function(event) {
            // Hide on escape.
            if (event.keyCode == 27)
                $menu._hide();
        });


    // --- 커스텀 기능 추가 시작 (Phantom 템플릿의 (function($){...})(jQuery); 래퍼 안에 있어야 합니다) ---

    // ✅ 이미지 확대 기능 함수 (하나로 통합)
    function bindZoomToImages() {
        document.querySelectorAll('.zoomable').forEach(img => {
            img.onclick = () => {
                const zoomModal = document.getElementById('imgZoomModal');
                const zoomTarget = document.getElementById('imgZoomTarget');
                zoomTarget.src = img.src;
                zoomModal.style.display = 'flex'; // flex로 변경하여 중앙 정렬 등 스타일링에 유리
            };
        });

        // 닫기 버튼 이벤트
        const closeBtn = document.querySelector('.img-zoom-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                document.getElementById('imgZoomModal').style.display = 'none';
            };
        }

        // 모달 외부 클릭 시 닫기 이벤트
        const zoomModal = document.getElementById("imgZoomModal");
        if (zoomModal) {
            zoomModal.addEventListener("click", e => {
                if (e.target === zoomModal) zoomModal.style.display = "none";
            });
        }
    }

    // ✅ DOM 로드 후 확대 기능 초기 바인딩
    // 이 부분은 페이지 로드 시 이미 존재하는 .zoomable 이미지들에 확대 기능을 연결합니다.
    document.addEventListener('DOMContentLoaded', bindZoomToImages);


    // ✅ 메뉴 열기 + 데이터 삽입 + 이미지 확대 기능
    document.querySelectorAll('.openMenu').forEach(el => {
        el.addEventListener('click', () => {
            const title = el.dataset.title;
            const address = el.dataset.address;
            const gallery = JSON.parse(el.dataset.gallery);
            const mapUrl = el.dataset.map;

            // 제목 & 주소 업데이트
            const titleEl = document.querySelector('#menuCaption h2');
            if (titleEl) titleEl.textContent = title;

            const addressEl = document.querySelector('#menuCaption p');
            if (addressEl) addressEl.textContent = '주소: ' + address;

            // 이미지 갤러리 업데이트
            const galleryDiv = document.querySelector('.modal-gallery');
            galleryDiv.innerHTML = ''; // 기존 이미지 비우기
            gallery.forEach((src, i) => {
                const img = document.createElement('img');
                img.className = 'zoomable';
                img.src = src;
                img.alt = `${title} 이미지 ${i + 1}`;
                galleryDiv.appendChild(img);
            });

            // 지도 업데이트
            const mapIframe = document.querySelector('.modal-map iframe');
            if (mapIframe) mapIframe.src = mapUrl;

            // 모달 열기
            const modal = document.getElementById('menuModal');
            modal.style.display = 'block';

            // 햄버거 메뉴 숨기기
            const hamburgerMenu = document.getElementById('hamburgerMenu');
            if (hamburgerMenu) hamburgerMenu.style.display = 'none';

            // 새로 추가된 이미지에 확대 이벤트 다시 연결
            bindZoomToImages();
        });
    });

    // ✅ 메뉴 모달 닫기 로직
    (function() {
        const modal = document.getElementById('menuModal');
        if (!modal) {
            // console.warn("menuModal 요소를 찾을 수 없습니다. 모달 닫기 로직이 작동하지 않을 수 있습니다.");
            return; // 모달이 없으면 더 이상 진행하지 않음
        }
        const closeBtn = modal.querySelector('.modal-close');
        const hamburgerMenu = document.getElementById('hamburgerMenu'); // 다시 참조

        // 닫기 버튼 클릭 시
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                if (hamburgerMenu) hamburgerMenu.style.display = ''; // 햄버거 다시 보이게
            });
        }

        // 모달 외부 클릭 시
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (hamburgerMenu) hamburgerMenu.style.display = '';
            }
        });
    })();


    // ✅ 네이버 지도 자동 이미지 생성
    const apiKey = "2o3dOApOb0m0ukotyGP7"; // 발급받은 Client ID 입력

    document.querySelectorAll('.map-thumbnail').forEach(img => {
        const lat = img.dataset.lat; // 위도
        const lng = img.dataset.lng; // 경도
        const width = 700;
        const height = 300;
        const level = 16;

        // 네이버 Static Map API URL
        // height 파라미터가 중복되어 하나를 제거했습니다.
        const mapUrl = `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=${width}&h=${height}&center=${lng},${lat}&level=${level}&X-NCP-APIGW-API-KEY-ID=${apiKey}`;

        img.src = mapUrl; // 이미지 경로 삽입
    });

    // --- 커스텀 기능 추가 끝 ---

})(jQuery); // <-- 기존 Phantom 템플릿의 닫는 괄호는 이 하나만 남아야 합니다.