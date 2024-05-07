import { illustrationsSet } from "@/layouts/default-layout/config/helper";
import { useThemeStore } from "@/stores/theme";

export const getIllustrationsPath = (illustrationName: string): string => {
  const extension = illustrationName.substring(
    illustrationName.lastIndexOf("."),
    illustrationName.length
  );
  const illustration =
    useThemeStore().mode == "dark"
      ? `${illustrationName.substring(
          0,
          illustrationName.lastIndexOf(".")
        )}-dark`
      : illustrationName.substring(0, illustrationName.lastIndexOf("."));
  return (
    import.meta.env.BASE_URL +
    `media/illustrations/${illustrationsSet.value}/${illustration}${extension}`
  );
};

export const getAssetPath = (path: string): string => {
  return import.meta.env.BASE_URL + path;
};

export const getApiUrl = (path: string): string => {
  return import.meta.env.VITE_APP_API_URL + path;
};


export const getUploadAssetPath = (path = '',prefix = '.sandbox/',noImage = 'no-image.webp'): string => {
  if(path != "" && path != null){
    if(path.includes('http')){
      return path;
    }else{
      return import.meta.env.BASE_URL + prefix +  path;
    }
  }else{
    if(noImage.includes('http')){
      return noImage;
    }else{
      return import.meta.env.BASE_URL + noImage;
    }
  }
  
};
