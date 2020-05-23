function handleDragStart(e) {
    // Target (this) element is the source node.
    this.style.opacity = '0.4';

    // dragSrcEl = this;
    console.log(e.dataTransfer.items.length);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    // e.dataTransfer.setData("text", e.target.id);


}

function handleDragOver(e) {

    e.dataTransfer.dropEffect = 'move';
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    // console.log(e.target);
}

function handleDragLeave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
}


function handleDrop(e) {
    // this / e.target is current target element.


    // See the section on the DataTransfer object.

    let data = e.dataTransfer.getData("text/html");

    console.log(data);
    e.target.innerHTML += data;

    console.log('drop', e.target, e.dataTransfer);

    // e.dataTransfer.clearData();

    // if (e.stopPropagation) {
    //     e.stopPropagation(); // stops the browser from redirecting.
    // }

}

function handleDragEnd (e)
{
    [].forEach.call(cols, function (col) {
        col.className = 'column';
    });

    // target element (this) is the source node.
    this.style.opacity = '1';

    if (e.dataTransfer.dropEffect === 'move') {
        e.target.parentNode.removeChild(e.target);
    }
};

function handleDragEnter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');

    console.log(e.target);

    // console.log(e.target);
}

window.addEventListener('load', function () {
    cols = document.querySelectorAll('#columns .column');
    [].forEach.call(cols, function(col) {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false)
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
    });

    let nodes = document.querySelectorAll('.slot');
    for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];

        n.addEventListener('dragover', handleDragOver, false);
        n.addEventListener('dragleave', handleDragLeave, false);
        n.addEventListener('drop', handleDrop, false);
        n.addEventListener('dragend', handleDragEnd, false);
    }


})
