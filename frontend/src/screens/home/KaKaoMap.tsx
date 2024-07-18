import React, { useEffect } from "react";

function KaKaoMap() {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { kakao } = window;
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          ),
          level: 3,
        };
        const map = new kakao.maps.Map(container, options);
        const markerPosition = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    }
  }, []);
  return <div id="map" className="w-screen h-[100%]"></div>;
}

export default KaKaoMap;
