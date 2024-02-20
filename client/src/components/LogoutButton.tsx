import { faArrowRightFromBracket } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const LogoutButton = () => {
  const onLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };
  return (
    <button className="icon-button" onClick={onLogout}>
      <FontAwesomeIcon icon={faArrowRightFromBracket} fontSize={40} className="text-gray-600" />
    </button>
  )
};