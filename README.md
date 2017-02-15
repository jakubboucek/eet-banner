# EET banner
Banner pro splnění povinností podle [zákona o EET](https://www.zakonyprolidi.cz/cs/2016-112#p25-2-a), v jednom scriptu, 2 kB, 1 request, TLS (SSL), asynchronní, hostováno
na [S3](https://aws.amazon.com/s3/), bez závislosti na jQuery, s podporou Tag manageru a navrženo se záměrem nejméně obtěžovat uživatele.

*[EN] Sorry, this readme is currently possible only in Czech, because main target users are in CZ.*

## Instalace
Pro nainstalování tohoto rozšíření stačí do stránky vložit následující kód:
```html
<script src="https://s3-eu-west-1.amazonaws.com/eet-banner/cs.js" async></script>
```
Kód můžete vložit kamkoliv do stránky, ale nejlépe někam mezi `<head>` a `</head>`.

## Úpravy vzhledu
Vzhled banneru lze snadno upravit nastavením vlastností pro třídu `.eet-banner`, abyste převážili výchozí nastavení, možná bude potřeba odkazovat se na `.eet-banner.eet-priority`.

Příklad změny na fixní verzi – užitečné v situaci, kdy základní vzhled rozbíjí layout stránky:
```css
.eet-banner.eet-priority {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
}
```
Obdobně můžete upravit i následující prvky: `.eet-banner.eet-priority span` pro text, `.eet-banner.eet-priority a` pro odkaz na citaci zákona a `.eet-banner.eet-priority img` pro ikonku.

## Úpravy funkčnosti
Banner lze konfigurovat pomocí konfigurační proměnné `eet_banner_config`.

### Změny textace
Textaci lze konfigurovat parametrem `l18n`, tedy např. změna popisu tlačítka:
```html
<script>
	var eet_banner_config = {
		"l18n": {
			"text": "Na EET vám kašlu!"
		}
	};
</script>
```
Takto lze přepsat všechny výchozí hodnoty ze souboru [source/l18n.cs.json](source/l18n.cs.json).

### Nastavení chování
Chování lze konfigurovat parametrem `options`, tedy např. zobrazování informací v novém okně:
```html
<script>
	var eet_banner_config = {
		"options": {
			"showIcon": false
		}
	};
</script>
```
Takto lze přepsat všechny výchozí hodnoty ze souboru [source/options.json](source/options.json).

#### Umístění banneru v kódu
Ve výchozím nastavení se banner vykresluje na na konec stránky (jako poslední potomek `<body>`), parametrem `insertTo` lze upravit toto chování. Pokud hodnotu nastavíte na `':body-begin'` nebo `':body-end'`, vloží se banner na začátek/konec stránky. Pokud zadáte jinou hodnotu, zkusí se najít takový element jako CSS selector a vloží banner na jeho konec.
**Upozornění:** Pokud nebude takový element v DOM stránky nalezen, banner se nezobrazí, ale nezobrazí se žádné varování.
```html
<script>
	var eet_banner_config = {
		"options": {
			"insertTo": "div.footer"
		}
	};
</script>
…
<div class="footer"><!-- Panel will be place here --></div>
```



#### Callback a propojení s Google Tag Manager
Pomocí parametrů `callback` a `dataLayerName` lze sledovat události banneru. Callback se hodí zejména pro sladění složitějšího designu stránky (když, např. zobrazený banner překrývá stránku), dataLayer pak posílá eventy pro měření uživatelského chování. Obě funkce jsou na sobě nezávislé, lze použít jednu z nich a nebo obě. Nicméně obě dostávají stejná data.

Callback předává dva parametry, `action` s názvem události (možné hodnoty: `'init'`,`'show'`,`'no-show'` a `'open-link'`) a `label` s dalšími informacemi (např.: důvod nezobrazení banneru u akce `'no-show'`). Příklad:

```html
<script>
	function myCallback( action, label ) {
		console.log(action, label);
		// Example output: 'no-show', 'unsupported browser'
	}
	var eet_banner_config = {
		"options": {
			"callback": myCallback
		}
	};
</script>
```

Do Google Tag Manageru pak provolává event nazvaný `eet-banner` se stejnými parametry jako Callback. Příklad:
```html
<script>
	var dataLayer = [];
	var eet_banner_config = {
		"options": {
			"dataLayerName": 'dataLayer' // Note: input variable name (in 'quotes'), no variable directly
		}
	};
	// Example event values: {event: 'eet-banner', action: 'no-show', label: 'unsupported browser'}
</script>
```
Více o použití proměnné `dataLayer` v GTM najdete v [dokumentaci](https://developers.google.com/tag-manager/devguide?hl=en#events) a nebo v článku [Variable Guide](http://www.simoahava.com/analytics/variable-guide-google-tag-manager/).

Tento kód uveďte vždy před voláním banneru, tedy např.:
```html
<script>
	var eet_banner_config = { … };
</script>
<script src="https://s3-eu-west-1.amazonaws.com/eet-banner/cs.js" async></script>
```

## Obtěžování uživatele
Uvědumuju si, že [nařízení zákona](https://www.zakonyprolidi.cz/cs/2016-112#p25-2-a) je zcela zbytečné a nesmyslné. Nedává mi proto smysl upozornění dělat obzvlášť výrazné a obtěžující.
Z toho důvodu je banner:
* psaná malým písmem,
* v nevýrazných barvách,
* nemá fixní pozici, aby se dala odrolovat pryč.

## Známé problémy
Text splňuje požadavky zákona s drobným nedostatkem, že se nezobrazí na příliš zastaralých prohlížečích (vyžaduje podporu [addEventListener](http://caniuse.com/#search=addEventListener) a [querySelector](http://caniuse.com/#search=querySelector)) a uživatelům s vypnutým JavaScriptem. Jednoduchost instalace je vykoupena právě tímto nedostatkem.

Problémy zobrazení:
* (zatím o žádných nevím, pokud vít, pošlete issue)

V většině případů pak doporučuji ve stránce doplnit stylopis, který banner změni na fixně pozicovaný.

Podpora browserů počítá pouze s moderními browsery. V zastaralých verzích se může banner zobrazit nesprávně a nebo může zcela chybět.
Záleží mi na tom, aby se ani ve starších verzích nic nerozbilo. Pokud se banner zobrazil opravdu chybně, prosím o nahlášení.

Připojovaný soubor má nastaveno velmi dlouhé cachování, aby tento soubor byl v koncových stanicích ukládán co nejdéle. Výhodou je velmi rychlé načítání. Nevýhodou je poměrně velký rozptyl verzí, které mohou mít v jednom okamžiku uživatelé na počítači. Při modifikacích a ovládání banneru dbejte na doporučení v návodech, které zohledňují zpětnou kompatibilitu.

## Zabezpečení
Knihovna je hostována na serverech Amazonu na službě [Simple storage service](https://aws.amazon.com/s3/), které vynikají vysokou dostupností a zabezpečením. Protože se jedná o script vkládaný do stránky, byla zvoleno toto řešení právě s ohledem na zabezpečení minimalizující možnosti neautorizovaného přístupu.

## Changelist
Look here: https://github.com/jakubboucek/eet-banner/releases