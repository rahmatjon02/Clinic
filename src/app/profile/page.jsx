import Link from "next/link";
import React from "react";

const Profile = () => {
  return (
    <div>
      <Link href={"/profile/appointments"} >Мои записи</Link>
    </div>
  );
};

export default Profile;
