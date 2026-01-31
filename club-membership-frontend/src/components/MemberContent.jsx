import lines2 from "../assets/lines2.png";
import linesflip from "../assets/lines-flip.png";
import Logo from "../assets/logoFile.png";
import stamp from "../assets/stamp.png";
import signatur from "../assets/signatur.png";
import hashtag2 from "../assets/hashtag2.png";
import name from "../assets/name.png";

const MemberContent = ({ user }) => {
  if (!user) return null;

  const validUpto = user.createdAt
    ? new Date(
        new Date(user.createdAt).setFullYear(
          new Date(user.createdAt).getFullYear() + 1,
        ),
      ).toLocaleDateString("en-GB")
    : "N/A";

  return (
    <div id="membership-card" className="relative">
      <div className="relative w-[1080px] h-[720px] pt-10 px-10 overflow-hidden bg-[#f7f4e8]">
        <img
          className="absolute right-0 bottom-0 w-[1240px]"
          src={linesflip}
          alt=""
        />
        <div className="w-full h-[180px] bg-gradient-to-r relative overflow-hidden from-[#203a8f] rounded-2xl to-[#1f6bd6]">
          <img
            src={lines2}
            alt="Card Background"
            className="absolute w-[1000px] h-[200px] -bottom-8 left-0"
          />
        </div>

        {/* CLUB BADGE */}
        <img
          src={Logo}
          alt="Club Badge"
          className="absolute flex ml-7 mt-16 w-27 top-[-12px] "
        />

        {/* HEADER TEXT */}
        <div className="">
          <img
            src={name}
            alt="Club Badge"
            className="absolute flex w-[1080px] ml-[190px] bottom-[360px] "
          />
          <img
            src={hashtag2}
            alt="Club Badge"
            className="absolute flex w-[280px] ml-[430px] bottom-[512px]  "
          />
        </div>

        {/* HASHTAG */}

        {/* PROFILE PHOTO */}
        <div className="absolute top-[100px] left-[170px] w-[280px] h-[280px] rounded-full bg-white p-2 border border-[3px] border-blue-600">
          <img
            src={user.photo}
            alt={user.name}
            className="w-full h-full rounded-full object-coverborder border-[2px] border-amber-300"
          />
        </div>

        {/* NAME & MEMBERSHIP */}
        <div className="absolute ml-[430px] top-[230px] pt-4 leading-none">
          <h2 className="text-[39px] font-bold text-yellow-600 uppercase">
            {user.nickname || user.name}
          </h2>
          <p className="text-2xl font-semibold text-yellow-600">
            {user.membershipId}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="absolute bottom-[79px] left-[160px] text-[20px] text-gray-900 ">
        <div className="grid grid-cols-[180px_20px_1fr] font-normal ">
          <div className="  uppercase pr-5">FULL NAME</div>
          <div className=" ">:</div>
          <div className="  font-semibold uppercase">
            {user.name}
          </div>

          <div className="  uppercase ">
            MEMBERSHIP ID
          </div>
          <div className=" ">:</div>
          <div className="  font-semibold">
            {user.membershipId}
          </div>

          <div className="  uppercase">MOBILE NO</div>
          <div className=" ">:</div>
          <div className="  font-semibold">
            {user.phone}
          </div>

          <div className="  uppercase">BLOOD GROUP</div>
          <div className=" ">:</div>
          <div className="  font-semibold">
            {user.bloodGroup || "O+ve"}
          </div>

          <div className="uppercase">VALID UPTO</div>
          <div>:</div>
          <div className="font-semibold">{validUpto}</div>
        </div>
      </div>

      {/* STAMP */}
      <img
        src={stamp}
        alt="Membership Stamp"
        className="absolute bottom-[30px] right-[250px] w-[290px] rotate-[-12deg] "
      />

      {/* SIGNATURE */}
      <div className="absolute bottom-[14px] right-[70px] text-center ">
        <img
          src={signatur}
          alt="Signature"
          className="w-[160px] flex justify-center "
        />
        <div>
          <p className="border-b border-b-zinc-500 mx-[-25px] "></p>
        </div>
        <p className="font-medium text-[12px] text-gray-600 pt-1 uppercase">
          Authorised Signatory
        </p>
        <p className="font-medium text-[12px] text-gray-600 uppercase">
          (Gen. Secretary)
        </p>
      </div>
    </div>
  );
};

export default MemberContent;
