var dLib = function () {
    var canvas, context, sizeX, sizeY;
    var lastPoint = {};

    //var shape = 

    return {
        eachNode: function walk(node, func) {
            func(node);
            node = node.firstChild;
            while (node) {
                walk(node, func);
                node = node.nextSibling;
            };
        },
            
        replace: function (id, text) {
            var node = document.getElementById(id);
            node.firstChild.nodeValue = text;
            return node;
        },
    
        appendTag: function (what, to) {
            return document.getElementsByTagName(to)[0].appendChild(document.createElement(what));
        },

        setup: function (width, height) {
            width = width || getComputedStyle(document.getElementsByTagName('body')[0], "").getPropertyValue('width');
            height = height || "500px"; // getComputedStyle(document.getElementsByTagName('body')[0], "").getPropertyValue('height');
            canvas = this.appendTag("canvas", "body");
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            canvas.setAttribute('style', "border: 1px #000 solid");
            sizeX = parseInt(width); sizeY = parseInt(height);
            context = canvas.getContext('2d');
            return this;
        },

        randInt: function (max) {
            return Math.floor(Math.random()*max);
        },

        randFill: function () {
            context || this.setup();
            context.fillStyle = "rgba(" + this.randInt(255) + ',' + this.randInt(255) + ',' + this.randInt(255) + ',1.0)';
            return this;
        },

        randCircle: function (max) {
            maxRadius =  max || 100;
            context || this.setup();
            var randInt = this.randInt;
            context.beginPath();
            context.arc(randInt(sizeX), randInt(sizeY), randInt(maxRadius), 0, Math.PI*2, true); 
            context.closePath();
            this.randFill();
            context.fill();            
            return this;
        },

        drawRect: function (x, y, width, height) {
            context.fillRect(x, y, width, height);
            return this;
        },

        drawCircle: function (x, y, radius) {
            context.arc(x, y, radius, 0, Math.PI*2, true);
            return this;
        }, 

        randRect: function (max) {
            max = max || 100;
            context || this.setup();
            var randInt = this.randInt;
            context.fillRect(randInt(sizeX), randInt(sizeY), randInt(max), randInt(max));
            return this;
        },

        rotate: function (angle) {
            context.translate(85, 0);  
            context.rotate(angle * Math.PI / 180);    
            context.rotate(angle);
            context.save();
            return this;
        },

        drawPath: function (toPoint, fromPoint) {
            if (fromPoint === undefined) {
                fromPoint = lastPoint;
            }
            if (fromPoint.x === undefined || fromPoint.y === undefined) {
                throw "Oops";
            }
            if (fromPoint !== lastPoint) { 
                context.beginPath();
                context.moveTo(fromPoint.x, fromPoint.y);
            }

            context.lineTo(toPoint.x, toPoint.y);
            lastPoint.x = toPoint.x; lastPoint.y = toPoint.y;
            context.stroke();
            return this;
        },

        randPath: function () {
            if (lastPoint.x === undefined || lastPoint.y === undefined) {
                lastPoint.x = this.randInt(sizeX);
                lastPoint.y = this.randInt(sizeY);
                console.log("In randPath(): lastPoint set to: " + lastPoint.x +", "+lastPoint.y);
            }
            this.drawPath(this.randPointNear(lastPoint));
            return this;
        },

        lastPoint: function () { return lastPoint; },

        canvasSize: function () { return {x:sizeX, y: sizeY}},

        randPointNear: function (point, distance) {
            var start = { x: (point.x - 50) > 0 ? (point.x - 50) : 0, y: (point.y - 50) > 0 ? (point.y - 50) : 0 };
            return {  x: (start.x + this.randInt(100)) % sizeX, y: (start.y + this.randInt(100)) % sizeY };
        }
    };
}();
