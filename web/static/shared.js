document.title = '@wheatwhole';
async function titleEffect() {
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function delay(time) {
		return new Promise((r) => setTimeout(r, time));
	}
	var cursorText = '';
	async function cursor() {
		var cursor = true;
		var speed = 100;
		setInterval(() => {
			if (cursor) {
				cursorText = '_';
				cursor = false;
			} else {
				cursorText = '';
				cursor = true;
			}
		}, speed);
	}

	async function typeAnimation(rtl, text, time) {
		for (let i = 1; i <= text.length; i++) {
			document.title = "@" + text.slice(0, rtl ? -i : +i);
			await delay(time);
		}
	}

	async function loopAnimation() {
		for (let s = 0; s > -1; s++) {
			await typeAnimation(true, 'Cyclone', 250);
			await sleep(500);
			await typeAnimation(false, 'Cyclone', 250);
			await sleep(500);
		}
	}

	loopAnimation();
}

titleEffect();