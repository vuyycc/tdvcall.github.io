const socket = io('https://call77.herokuapp.com/', { transports: ['websocket'] });

$('#div-chat').hide();


socket.on('DANH_SACH_ONLINE', arrUser => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();
    arrUser.forEach(user => {
        const {name, peerId} = user;
        $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
    })

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { name, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
    })

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    })
})

socket.on('DANG_KY_THAT_BAI', () => {
    alert("Vui long chon username khac~");
})


function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
//     .then(stream => playStream('localStream', stream));
var peer = new Peer({ key: 'peerjs', host: 'mypeer176.herokuapp.com', secure: true, port: 443 });
peer.on('open',id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', {name: username, peerId: id});
    });
});

//Nguoi goi di
// $('#btnCall').click(() => {
//     const id = $('#remoteId').val();
//     openStream()
//     .then(stream => {
//         playStream('localStream',stream);  
//         const call = peer.call(id, stream);
//         call.on('stream', remoteStream => playStream('remoteStream',remoteStream)) 
//     })
// })

//Nguoi nhan
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    })
})

$('#ulUser').on('click','li', function() {
    const id = $(this).attr('id');
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
        })
});

// $('#btnSignUp').click(() => {
// 	const username = $('#txtUsername').val();
// 	socket.emit('NGUOI_DUNG_DANG_KY', username);
// })
