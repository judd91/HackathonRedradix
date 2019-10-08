"use strict";

function rand(n) {
    return Math.floor(Math.random() * n)
}
const RAD_TO_DEG = 180 / Math.PI 
async function go(tank, destX, destY) {

    let curX = await tank.getX()
    let curY = await tank.getY()
    while (distance(await tank.getX(), await tank.getY(), destX, destY) > 250) {
        let curX = await tank.getX()
        let curY = await tank.getY()
        let dist = distance(curX, curY, destX, destY)
        let course = plotCourse(curX, curY, destX, destY)
		await tank.drive(course, 100)
    }
    while (await tank.getSpeed() > 50)
	await tank.drive(0, 0)
}
function distance(x1, y1, x2, y2) {
    let x = x1 - x2
    let y = y1 - y2
    return Math.sqrt((x * x) + (y * y))
}
function plotCourse(curX, curY, xx, yy) {

    let x = curX - xx
    let y = curY - yy
    let d = 0
    if (x === 0) {
        if (yy > curY) d = 90
        else
			d = 270
    } else {
        if (yy < curY) {
            if (xx > curX)
				d = 360 + RAD_TO_DEG * Math.atan(y / x)
            else
				d = 180 + RAD_TO_DEG * Math.atan(y / x)
        } else {
            if (xx > curX)
				d = RAD_TO_DEG * Math.atan(y / x)
            else
				d = 180 + RAD_TO_DEG * Math.atan(y / x)
        }
    }
    return d
}

async function petar(tank) {
	var i = 0;
	for (i = 0; i < 360; i = i + 5) {
		await tank.shoot(i, 50); //petar al de al lado
	}
}
// var sec = Date.now();

async function main(tank) {
    let currentDamage = await tank.getDamage();
    let range = 0
    let x = 0
    let posX = await tank.getX();
    let posY = await tank.getY();
    console.log(posX, posY)
    if (posX == 628 && posY == 833) x = 225;
    if (posX == 628 && posY == 167) x = 45;
    if (posX == 294 && posY == 500) x = 315;
    if (posX == 961 && posY == 500) x = 135;
	
	
    while (true) {
		// var sec_now = Date.now();

		if (await tank.getDamage() > currentDamage ){
			await petar(tank);
			await go(tank, rand(1000), rand(1000));
			currentDamage = await tank.getDamage();
		}
	
        if (await tank.scan(x, 10) !== 0) {

// console.log("Sec",sec)
// console.log("Sec now",sec_now)
// console.log(sec_now - sec)
			x += 5 - Number(await tank.scan(x - 5, 5) !== 0) * 10;
			// if ((sec_now - sec) >= 3000){
				// await tank.shoot(x + 1, range + 5)
				// await tank.shoot(x - 1, range + 5)
				// sec = sec_now;
				// sec_now = Date.now();
			// }
            if ((range = await tank.scan(x, 10)) > 20) {
				await tank.shoot(x, range + 5)
				await tank.shoot(x - 13, range + 5)
                if (range > 200) await tank.drive(x, 50)
                else {
                    if (await tank.getX() > 150 && await tank.getX() < 1150 && await tank.getY() > 150 && await tank.getY() < 850)
                        await tank.drive(180 - x, 0);
                    else {
                        if (await tank.getX() <= 150) {
                            await tank.drive(0, 100);
                            while (await tank.getX() <= 150);
                            await tank.drive(0, 0);
                        }
                        if (await tank.getX() >= 1150) {
                            await tank.drive(180, 100);
                            while (await tank.getX() >= 1150);
                            await tank.drive(0, 0);
                        }
                        if (await tank.getY() <= 150) {
                            await tank.drive(90, 100);
                            while (await tank.getY() <= 150);
                            await tank.drive(0, 0);
                        }
                        if (await tank.getY() >= 850) {
                            await tank.drive(270, 100);
                            while (await tank.getY() >= 850);
                            await tank.drive(0, 0);
                        }
                    }
                }
            }
            x -= 20;
        } else {
            x += 20;
            if (await tank.getX() <= 150) {
                await tank.drive(0, 100);
                while (await tank.getX() <= 150);
                await tank.drive(0, 0);
            }
            if (await tank.getX() >= 1150) {
                await tank.drive(180, 100);
                while (await tank.getX() >= 1150);
                await tank.drive(0, 0);
            }
            if (await tank.getY() <= 150) {
                await tank.drive(90, 100);
                while (await tank.getY() <= 150);
                await tank.drive(0, 0);
            }
            if (await tank.getY() >= 850) {
                await tank.drive(270, 100);
                while (await tank.getY() >= 850);
                await tank.drive(0, 0);
            }
        }
    }
}