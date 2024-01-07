import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full inline-flex flex-col justify-center items-center">
        <div className="text-3xl font-bold p-4 mb-12">LOGIN</div>
        <div className="inline-flex flex-col w-[400px] mb-12">
          <div className="flex justify-between p-4">
            <label className="text-xl font-semibold">ID</label>
            <input className="border-2 border-solid border-gray-500" />
          </div>
          <div className="flex justify-between p-4">
            <label className="text-xl font-semibold">Password</label>
            <input
              type="password"
              className="border-2 border-solid border-gray-500"
            />
          </div>
          <div className="flex justify-center mt-8">
            <button className="text-white font-bold bg-blue-700 w-[400px] h-[30px]">
              로그인
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <p className="font-bold text-gray-500">회원가입</p>
          </div>
        </div>
      </div>
    </main>
  );
}
