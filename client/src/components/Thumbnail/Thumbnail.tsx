import React, { useEffect } from "react";

interface ThumbProps {
  file: any;
}

const Thumb: React.FC<ThumbProps> = ({ file }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [thumb, setThumb] = React.useState<any>(undefined);

  useEffect(() => {
    if (!file) return;

    setLoading(true);

    let reader = new FileReader();

    reader.onloadend = () => {
      setLoading(false);
      setThumb(reader.result);
    };

    reader.readAsDataURL(file);
  }, [file]);

  if (!file) return null;
  if (loading) return <p>Loading...</p>;

  return <img src={thumb} alt={file.name} width={200} />;
};

export default Thumb;
