var dLib = function () {
    var canvas, context, sizeX, sizeY;
    var lastPoint = {};
    // shapes need to respond to the draw method
    var shapes = [];

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
            var fill = "rgba(" + this.randInt(255) + ',' + this.randInt(255) + ',' + this.randInt(255) + ',1.0)';
            //context.fillStyle = fill;
            return fill;
        },

        newCircle: function (startX, startY, startRad, startFill) {
            var circle = {
                x: startX,
                y: startY,
                radius: startRad,
                fill: startFill,
                draw: function() {
                    if (context !== undefined) {
                        context.beginPath();
                        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
                        //context.arc(10, 20, 30, 0, Math.PI*2, true); 
                        context.closePath();
                        context.fillStyle = this.fill;
                        context.fill();
                    }
                }
            };
            shapes.push(circle);
            return circle;
        },

        randCircle: function (max) {
            maxRadius =  max || 100;
            context || this.setup();
            var randInt = this.randInt;
            this.newCircle(randInt(sizeX), randInt(sizeY), randInt(maxRadius), this.randFill()).draw(); 
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

        shapes: function () { return shapes; },

        context: function () { return context; },

        randPointNear: function (point, distance) {
            dist = distance || 50;
            var start = { x: (point.x - dist) > 0 ? (point.x - dist) : 0, y: (point.y - dist) > 0 ? (point.y - dist) : 0 };
            return {  x: (start.x + this.randInt(dist * 2)) % sizeX, y: (start.y + this.randInt(dist * 2)) % sizeY };
        },

        trackMouse: function (obj) {
            return function (e) {
                if (!e) var e = window.event;
                if (e.pageX || e.pageY) 	{
                    obj.mouseX = e.pageX;
                    obj.mouseY = e.pageY;
                }
                else if (e.clientX || e.clientY) 	{
                    obj.mouseX = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
                    obj.mouseY = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
                }
            };
        },

        draw: function () {
            var i = 0;
            var shape;

            context.clearRect(0, 0, sizeX, sizeY);

            for (i = 0; i < shapes.length; ++i) {
                shape = shapes[i];
                if (shape.update !== undefined) {
                    shape.update();
                }
                if (shape.draw !== undefined) {
                    shape.draw();
                }
            }
        }
    };
}();
