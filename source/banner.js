(function(w, d){
	var identificator = 'eet-banner';
	var userVariable = 'eet_banner_config';
	var DOMContentLoaded = 'DOMContentLoaded';
	var load = 'load';
	var click = 'click';

	var includes = <%= JSON.stringify({
				version: pkg.version,
				css: css,
				icon: 'data:image/svg+xml;base64,' + icon,
				l18n: l18n,
				options: options
			}, null, '\t') %>;

	var config = {};

	function init() {
		w[userVariable] = w[userVariable] || {};
		config = buildConfig(includes, w[userVariable]);

		invokeEvent('init', includes.version);

		if( !w.addEventListener || !d.querySelector ) {
			//To keep things simple are old browsers unsupported
			invokeEvent('no-show', 'unsupported browser');
			return;
		}

		if ( d.readyState === 'complete' ) {
			setTimeout( dry );
		} else {
			d.addEventListener( DOMContentLoaded, completed, false );
			w.addEventListener( load, completed, false );
		}
	};

	function completed() {
		d.removeEventListener( DOMContentLoaded, completed, false );
		w.removeEventListener( load, completed, false );
		dry();
	}

	function dry(){
		var html = '<span>%c%</span>';
		if(config.options.showIcon) {
			html = '<img src="%i%" alt="%t%" title="%t%">' + html;
		}
		var baseimgUrl
		html = html
			.replace(/%c%/g, config.l18n.text)
			.replace(/%link%/g, config.l18n.link)
			.replace(/%t%/g, config.l18n.title)
			.replace(/%i%/g, config.icon);
		var body = d.body;
		var head = d.head;
		var style = d.createElement('style');
		style.type = 'text/css';
		style.appendChild(d.createTextNode(includes.css));

		var div = d.createElement('div');
		div.className = identificator + ' eet-priority';
		div.innerHTML = html;
		head.appendChild(style);
		var insertTo = config.options.insertTo;
		var insertBefore = config.options.insertBefore;
		var insertBeforeElement;
		var targetElement;
		if (insertTo == ':body-begin') {
			body.insertBefore(div, body.firstChild);
		} else if (insertTo == ':body-end') {
			body.appendChild(div);
		} else if (targetElement = d.querySelector(insertTo)) {
			if(insertBefore) {
				insertBeforeElement = targetElement.querySelector(insertBefore);
			}
			targetElement.insertBefore(div, insertBeforeElement);
		} else if(console) {
			console.warn('%s warning: Unable to append banner, element "%s" not found.', identificator, insertTo);
			invokeEvent('no-show', 'dom-insert-error');
		}
		var a = div.querySelector('a');
		a.addEventListener(click, function(){ invokeEvent('open-link'); });
		if(config.options.popupLink) {
			a.setAttribute('target', '_blank');
		}

		invokeEvent('show');
	}

	function buildConfig(defaults, mods) {
		var config = {};
		for(var key in defaults) {
			if( typeof mods[key] === 'undefined' ) {
				config[key] = defaults[key];
			}
			else if(typeof mods[key] === 'object'){
				config[key] = buildConfig(defaults[key], mods[key]);
			}
			else {
				config[key] = mods[key];
			}
		}
		return config;
	}

	function invokeEvent( action, label ) {
		if (typeof(config.options.callback) === 'function') {
			config.options.callback( action, label );
		}
		var dataLayer = config.options.dataLayerName;
		if (dataLayer && w[dataLayer] && typeof(w[dataLayer].push) === 'function') {
			w[dataLayer].push({
				'event': identificator,
				'action': action,
				'label': label
			});
		}
	}

	init();

})(window, window.document);
