var dLib = function () {
    var canvas, context, sizeX, sizeY;
    var lastPoint = {};

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
            sizeX = width || 1000; sizeY = height || 600;
            canvas = this.appendTag("canvas", "body");
            canvas.setAttribute('width', sizeX);
            canvas.setAttribute('height', sizeY);
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

        randCircle: function () {

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

        randPath: function () {
            if (!lastPoint.x || !lastPoint.y) {
                lastPoint.x = this.randInt(sizeX);
                lastPoint.y = this.randInt(sizeY);
                context.beginPath();
                context.moveTo(lastPoint.x, lastPoint.y);
            }

            var newPoint = this.randPointNear(lastPoint);
            context.lineTo(newPoint.x, newPoint.y);
            lastPoint = newPoint;
            context.stroke();
            return this;
        },

        randPointNear: function (point, distance) {
            var start = { x: (point.x - 50) > 0 ? (point.x - 50) : 0, y: (point.y - 50) > 0 ? (point.y - 50) : 0 };
            return {  x: (start.x + this.randInt(100)) % sizeX, y: (start.y + this.randInt(100)) % sizeY };
        }
    };
}();
