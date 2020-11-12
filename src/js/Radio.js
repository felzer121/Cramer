import * as $ from "jquery";

const getTemplale = (coordinateRadio = [], signalReceivingTime = [], speed) => {
    let t = 260, l = 200;
    let index = 0;
    let dot = [];
    const TimeSignal = signalReceivingTime.map(item => {
        let doubleSystem = [];
        let dt = [item[0], item[1], item[2]];
        let x1 = '', y1 = '', t1 = '', result = '';
        // инициализация системы уравнений и вычитание первого уравнения из двух остальных
        dt.map((item, i) => {
            let expression = [];
            expression[i] = Expression(coordinateRadio[i].x, coordinateRadio[i].y, item, speed);
            expression[i][2][1] = expression[i][2][1] - expression[i][0][1] - expression[i][1][1];
            delete expression[i][0][1]; delete expression[i][1][1];
            if (x1 === '' && y1 === '') {
                x1 = expression[i][0][0];
                y1 = expression[i][1][0];
                t1 = expression[i][2][0];
                result = expression[i][2][1];
            }
            if (i >= 1) {
                doubleSystem[i - 1] = [x1-expression[i][0][0], y1-expression[i][1][0], t1-expression[i][2][0], result-expression[i][2][1]];
            }
        });
        let cop = Kramer(doubleSystem);
        cop[0] = Math.abs(Math.round(cop[0]) / 100);
        cop[1] = Math.abs(Math.round(cop[1]) / 100);
        let lol = [ cop[0], cop[1] ];
        renderDots(lol, dot, index);
        index++;
    });

    const coordinate = coordinateRadio.map(item => {
        let div = document.createElement('div');
        div.className = "radio";
        div.style.position = "absolute";
        div.style.marginLeft = item.x + 'px';
        div.style.marginTop = item.y + 'px';
        div.innerHTML = "<svg width=\"24\" height=\"24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "<path d=\"M12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14.0005 12.472 13.834 12.9289 13.53 13.29L16.7 22H14.57L12 14.93L9.43 22H7.3L10.47 13.29C10.166 12.9289 9.99954 12.472 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10V10ZM12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12C8 12.5 8.1 13 8.28 13.46L7.4 15.86C6.49585 14.7769 6.0004 13.4109 6 12C6 10.4087 6.63214 8.88258 7.75736 7.75736C8.88258 6.63214 10.4087 6 12 6C13.5913 6 15.1174 6.63214 16.2426 7.75736C17.3679 8.88258 18 10.4087 18 12C18 13.47 17.47 14.81 16.6 15.86L15.72 13.46C15.9 13 16 12.5 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8V8ZM12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.36 5 16.5 6.64 17.94L5.92 19.94C4.70111 19.0061 3.71354 17.8042 3.03377 16.4273C2.354 15.0504 2.00028 13.5355 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 15.23 20.46 18.11 18.08 19.94L17.36 17.94C19 16.5 20 14.36 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4V4Z\" fill=\"black\"/>\n" +
            "</svg>\n";
        document.body.append(div);
    });
    return `
       ${coordinate.join('')}
    `
};
// отрисовка точек радиопередатчика
function renderDots(coordinate, dot, index) {
    let div = document.createElement('div');
    let div1 = document.createElement('div');
    div1.classList.add("coordinate" + index);
    let elem = document.getElementById('out');
    let dotClass = div.className = "lol" + index;
    div.style.position = "absolute";
    div.style.marginLeft = coordinate[0] + 'px';
    div.style.marginTop = coordinate[1] + 'px';
    elem.append(div1);
    div1.innerHTML = ' x = ' + coordinate[0] + '   y = ' + coordinate[1];
    div.innerHTML = "<svg width=\"24\" height=\"24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "<path d=\"M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z\" fill=\"#9EAD66\"/>\n" +
        "<path d=\"M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z\" fill=\"#9EAD66\"/>\n" +
        "</svg>\n";
    document.body.append(div);
    let line = document.createElement('div');

    dot[index] = dotClass;
    if (dot.length >= 2) {
        if(dot.length > 2) {
            dot = [dot[index-1], dot[index]]
        }
        line.className = "line line" + index;
        document.body.append(line);
        line = '.' + line.classList[1];
        drawLine( dot[0], dot[1], line );
    }
}
// отрисовка линий соединяющих радиопередатчик
function drawLine(a, b, line) {
    var pointA = $('.' + a).offset();
    var pointB = $('.' + b).offset();
    var pointAcenterX = $('.' + a).width() / 2;
    var pointAcenterY = $('.' + a).height() / 2;
    var pointBcenterX = $('.' + b).width() / 2;
    var pointBcenterY = $('.' + b).height() / 2;
    var angle = Math.atan2(pointB.top - pointA.top, pointB.left - pointA.left) * 180 / Math.PI;
    var distance = lineDistance(pointA.left, pointA.top, pointB.left, pointB.top);


    // Set Angle
    $(line).css('transform', 'rotate(' + angle + 'deg)');

    // Set Width
    $(line).css('width', distance + 'px');

    // Set Position
    $(line).css('position', 'absolute');
    if(pointB.left < pointA.left) {
        $(line).offset({top: pointA.top + pointAcenterY - 5, left: pointB.left + pointBcenterX});
    } else {
        $(line).offset({top: pointA.top + pointAcenterY - 5, left: pointA.left + pointAcenterX});
    }
}
function lineDistance(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

function Expression(x,y,dt, speed) {
    let bracketX = [-x*2, Math.pow(x, 2)];
    let bracketY = [-y*2, Math.pow(y, 2)];
    dt =  dt * speed;
    let bracketT = [dt*2*speed, Math.pow(dt, 2)];
    return [bracketX, bracketY, bracketT];
}
// вычисление уравнения методом Краммера (t представляем константой)
function Kramer (mass) {
    mass.map(item => {
        item[2] = item[2] + item[3]
        delete item[3]
    });
    let coordinate = [];
    let determinant = mass[0][0]*mass[1][1] - mass[0][1] * mass[1][0];
    let determinantX1 = mass[0][2]*mass[1][1] - mass[0][1] * mass[1][2];
    let determinantX2 = mass[0][0]*mass[1][2] - mass[0][2] * mass[1][0];
    coordinate[0] = determinantX1 / determinant;
    coordinate[1] = determinantX2 / determinant;
    return coordinate;
}

export default class Radio {
    constructor(selector, options) {
        this.$el = document.querySelector(selector);
        this.options = options;
        this.speed = 1000;
        this.render();
    }
    render () {
        let signal = this.options.signalReceivingTime[0].dt1;
        signal = signal + '';
        signal = signal.split(',');
        signal  = signal.map(function(item) {
            let number = parseInt(item);
            return isNaN(number)? item : number;
        });
        let arr2 = [];
        for (let i = 0; i < signal.length; i++) {
            !(i % 3) && arr2.push([]);
            arr2[i / 3 << 0].push(signal[i]);
        }
        console.log(arr2)
        const {coordinateRadio} = this.options;
        this.$el.innerHTML = getTemplale(coordinateRadio, arr2, this.speed);
    }
}