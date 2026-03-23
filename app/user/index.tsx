import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function UserIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/auth");
  }, []);

  return null;
}