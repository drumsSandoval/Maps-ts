
const getUserLocation = async (): Promise<[number, number]> => {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(({coords}) => {
             res([coords.longitude, coords.latitude]);
        }, (err) => {
            alert('No se pudo obtener la geolocalizacion');
            console.log('error', err);
            rej();
        } );
    });
}

export default getUserLocation;