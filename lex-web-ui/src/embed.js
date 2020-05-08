(function lexWidget() {
	const styles = 'width: 90px; height: 90px; position: fixed; border: 0px; bottom: 0px; right: 0px; z-index: 2147483647; transition: height 0s;';

	const iframe = document.createElement('iframe');
	iframe.src = document.querySelector('script[data-widget-url]').dataset.widgetUrl;
	iframe.style = `${styles} visibility: hidden;`;
	setTimeout(()=>{
			iframe.style = styles;
	}
	, 1500);
	iframe.setAttribute('allowFullScreen', '');
	document.body.appendChild(iframe);

	const iframeWindow = iframe.contentWindow || iframe.contentDocument;
	const config = {
			attributes: true,
			childList: true,
			subtree: true
	};

	const callback = function() {
			const isOpened = iframeWindow.document.body.querySelector('.is-opened');
			if (isOpened) {
					const height = screen.height - 100
					if (window.top.innerWidth < 355 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
							iframe.style = `${styles} max-width: 100%;
					top: 0;
					left: 0;
					padding: 0;
					height: 100%;						width: 100%;

					max-height: 100%;`;
							window.top.document.documentElement.classList.add("mobile-widget--open");
							window.top.document.body.classList.add("mobile-widget--open");
					} else {
							iframe.style = `${styles}   position: fixed;
					width: 100%;
					max-width: 355px;
					padding: 0px;
					height: 100%;
					max-height: 709px;
				`;

					}
			} else {
					const lexDiv = iframeWindow.document.querySelector('#lex-web');

					if (lexDiv && lexDiv.clientHeight < 100) {
							iframe.style = styles;
							if (window.top.document.documentElement.classList.contains('mobile-widget--open')) {
									window.top.document.documentElement.classList.remove("mobile-widget--open");
							}
							if (window.top.document.body.classList.contains('mobile-widget--open')) {
									window.top.document.body.classList.remove("mobile-widget--open");
							}
					}
			}
	};
	const observer = new MutationObserver(callback);
	window.onresize = function() {
			callback();
	}
	iframe.onload = function() {
			const htmlNode = iframeWindow.document.querySelector('html');
			const bodyNode = iframeWindow.document.querySelector('body');
			htmlNode.style = 'overflow-y: hidden; height: 100%; width: 100%';
			bodyNode.style = 'height: 100%; width: 100%';

			observer.observe(iframeWindow.document.body, config);

			const chatButton = iframeWindow.document.body.querySelector('.btn--chat')
			document.querySelectorAll('.lexapp-open-chat').forEach(node=>{
					node.addEventListener('click', ()=>chatButton.click())
			}
			)
	}
	;
}());

window.addEventListener('load', function() {
	var css = '.mobile-widget--open { position: static; overflow-y: hidden}'
		, head = window.top.document.head
		, style = document.createElement('style');
	head.appendChild(style);

	style.type = 'text/css';
	if (style.styleSheet) {
			// This is required for IE8 and below.
			style.styleSheet.cssText = css;
	} else {
			style.appendChild(document.createTextNode(css));
	}
});
