// https://codepen.io/ettrics/embed/QbPEeg?height=450&theme-id=0&slug-hash=QbPEeg&default-tab=result&user=ettrics&embed-version=2&pen-title=Kanban%20Drag%20and%20Drop&preview=true&name=cp_embed_2#result-box
// Variant with predefined drop zones

class KanbanBoard {
    constructor(placeholder) {
        this.placeholder = document.querySelector(placeholder);
        this.init();
    }

    getOffset (el) {
        let rect = el.getBoundingClientRect();
        return {
            left: rect.left + this.getScroll('scrollLeft'),
            top: rect.top + this.getScroll('scrollTop'),
            width: el.offsetWidth,
            height: el.offsetHeight
        };
    }

    getScroll (scrollProp) {
        if (document.documentElement.clientHeight) {
            return document.documentElement[scrollProp];
        }

        return document.body[scrollProp];
    }

    init() {
        let columns = this.placeholder.querySelectorAll(' [data-role="column"]');

        for (let column of columns) {
            let items = column.querySelectorAll('[data-role="drag-item"]');
            for (let item of items) {
                item.setAttribute('draggable', true);
                item.addEventListener("dragstart", this.dragStartHandler.bind(this, item));
                item.addEventListener("dragend", this.dragEndHandler.bind(this, item))
            }
        }
    }

    initDropZoneItems(currentItem) {
        let columns = this.placeholder.querySelectorAll(' [data-role="column"]');
        for (let column of columns) {
            let items = column.querySelectorAll('[data-role="drag-item"]');

            if (items.length === 0) {
                this.initDropZoneItem(column.firstChild);

                continue;
            }

            let init = false;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (currentItem === item) {
                    continue;
                }

                if (!init) { // insert first drop zone
                    init = true;
                    this.initDropZoneItem(item, false);
                }

                this.initDropZoneItem(item);
            }
        }
    }

    initDropZoneItem(item, after = true) {
        let dropZone = document.createElement('li');
        dropZone.classList.add('drop-item');
        dropZone.setAttribute('data-role', 'drop-item');

        if (after) {
            item.parentNode.insertBefore(dropZone, item.nextSibling);
        } else {
            item.parentNode.insertBefore(dropZone, item);
        }

        dropZone.addEventListener("dragover", this.containerDragOverHandler.bind(this, dropZone));
        dropZone.addEventListener("dragenter", this.containerDragEnterHandler.bind(this, dropZone))
        dropZone.addEventListener("dragleave", this.containerDragLeaveHandler.bind(this, dropZone))
        dropZone.addEventListener("drop", this.containerDragDropHandler.bind(this, dropZone))
    }

    dragStartHandler(element, event) {
        console.log('Drag Start', element, event);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
        // event.dataTransfer.clearData('text');
        // event.dataTransfer.setData('text', this.id);

        let dropItems = this.placeholder.querySelectorAll('[data-role="drop-item"]');
        for (let dropItem of dropItems) {
            dropItem.classList.add('active');
        }

        event.target.classList.add('is-moving');
        event.target.setAttribute('data-moving', '1');
        // element.classList.add('is-moving');
        this.initDropZoneItems(event.target);
    }

    dragEndHandler(element, event) {
        console.log('Drag End', element, event);
        event.target.classList.remove('is-moving');
        event.target.removeAttribute('data-moving');

        let dropItems = this.placeholder.querySelectorAll('[data-role="drop-item"]');
        for (let dropItem of dropItems) {
            dropItem.remove();
        }

        // add the 'is-moved' class for 600ms then remove it
        window.setTimeout(function() {
            event.target.classList.add('is-moved');
            window.setTimeout(function() {
                event.target.classList.remove('is-moved');
            }, 600);
        }, 100);
    }

    containerDragOverHandler(column, event) {
        event.preventDefault();
    }

    containerDragEnterHandler(column, event) {
        console.log('Drag Enter', event);
        let x = event.x,
            y = event.y,
            relatedTarget = event.relatedTarget,
            item = this.placeholder.querySelector('[data-moving]');

        console.log(relatedTarget);
        if (relatedTarget) {
            console.log(this.getOffset(relatedTarget));
        }

        event.target.classList.add('hovered');

        let transitElement = this.placeholder.querySelector('[data-moving]');
        event.target.parentNode.insertBefore(transitElement, event.target);
    }

    containerDragLeaveHandler(column, event) {
        event.target.classList.remove('hovered');
    }

    containerDragDropHandler(column, event) {
        console.log('Drop', event);
        event.dataTransfer.dropEffect = 'move';
    }

}

window.addEventListener(
    'load',
    function () {


        let createOptions = (function() {
            let dragOptions = document.querySelectorAll('.drag-options');

            // these strings are used for the checkbox labels
            let options = ['Research', 'Strategy', 'Inspiration', 'Execution'];

            // create the checkbox and labels here, just to keep the html clean. append the <label> to '.drag-options'
            function create() {
                for (let i = 0; i < dragOptions.length; i++) {

                    options.forEach(function(item) {
                        let checkbox = document.createElement('input');
                        let label = document.createElement('label');
                        let span = document.createElement('span');
                        checkbox.setAttribute('type', 'checkbox');
                        span.innerHTML = item;
                        label.appendChild(span);
                        label.insertBefore(checkbox, label.firstChild);
                        label.classList.add('drag-options-label');
                        dragOptions[i].appendChild(label);
                    });

                }
            }

            return {
                create: create
            }

        }());

        let showOptions = (function () {

            // the 3 dot icon
            let more = document.querySelectorAll('.drag-header-more');

            function show() {
                // show 'drag-options' div when the more icon is clicked
                let target = this.getAttribute('data-target');
                let options = document.getElementById(target);
                options.classList.toggle('active');
            }


            function init() {
                for (let i = 0; i < more.length; i++) {
                    more[i].addEventListener('click', show, false);
                }
            }

            return {
                init: init
            }
        }());

        createOptions.create();
        showOptions.init();

        let b = new KanbanBoard('[data-role="drag-root"]');
    },
    false
);