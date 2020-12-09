const controls = document.getElementById("controls");

let dirX = 0,
	dirY = -1;

let _lastDirX = dirX,
	_lastDirY = dirY;

document.addEventListener("keydown", (ev) => {
	updateDir("KeyW", "KeyS", "KeyA", "KeyD", ev.code);
});

controls.addEventListener("touchstart", (ev) => {
	const target = ev.target.closest("button");
	if (!target) return;
	updateDir("up", "down", "left", "right", target.id);
});

function updateDir(up, down, left, right, key) {
	switch (key) {
		case up:
			if (_lastDirY === 1) break;
			dirX = 0;
			dirY = -1;
			break;

		case down:
			if (_lastDirY === -1) break;
			dirX = 0;
			dirY = 1;
			break;

		case left:
			if (_lastDirX === 1) break;
			dirX = -1;
			dirY = 0;
			break;

		case right:
			if (_lastDirX === -1) break;
			dirX = 1;
			dirY = 0;
			break;
	}
}

function getUserInput() {
	_lastDirX = dirX;
	_lastDirY = dirY;
	return {dirX, dirY};
}
export default getUserInput;
