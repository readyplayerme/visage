import React, { FC, useState } from 'react';
import { StatsGl } from '@react-three/drei';
import { Avatar } from 'src/library';
import styles from './App.module.scss';

const pickRandomFromArray = (array: any) => array[Math.floor(Math.random() * array.length)];
const generateRandomHexColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const EditorComponent: FC = () => {

    const COMPILE_URL = 'https://api.readyplayer.dev/v3/avatars/editor/compile';

    // please use these query strings to get different quality of the avatar for lazy loading
    const HIGH_QUALITY_QUERY_STING = '?textureQuality=medium';
    const LOW_QUALITY_QUERY_STING = '?textureQuality=low&meshCompression=true&globalMeshSimplify=true';
    
    const exampleEditorRequest = {
        "data": {
            "userId": "667c2423cd20a9000c61858c",
            "identityId": "664f0f1ccfa4727058e2e830",
            "applicationId": "66680a27d2e43fecc863cd67",
            "blueprintId": "65e0a59ebba2f3e2a45841ee",
            "gender": "male",
            "colors": {
                "eye": generateRandomHexColor(),
                "skin": generateRandomHexColor(),
                hair: {
                    primary: generateRandomHexColor(),
                    secondary: generateRandomHexColor()
                },
                eyebrows: {
                    primary: generateRandomHexColor(),
                    secondary: generateRandomHexColor()
                },
            },
            "assets": {
                  bottom: pickRandomFromArray([
                    "b6f33309-1482-4e37-8ca3-442edcd2d5b9",
                    "246a5238-10b6-4787-9d71-7b35c4386bb7",
                    "d5742f53-a45e-4d03-9cf1-812d25b7de2a",
                    ""
                ]),
                top: pickRandomFromArray([
                    "01f1a32c-ffe8-4ea5-b0d2-f48dd7d972ef",
                    "95c8ae1d-b2e0-49de-9c2d-7e5292556568",
                    "6c505824-0d5a-4198-8ea6-1f0d5eafbfb9",
                    ""
                ]),
                footwear: pickRandomFromArray([
                    "d15331b4-594e-4056-b9ee-93b88d7d7262",
                    "3456dc33-0998-445f-8abb-b2dd1292d83b",
                    "25de0e0d-e633-4dd4-b07b-8717bec82338",
                    ""
                ]),
                hair: pickRandomFromArray([
                    "07689bc6-109e-4c78-a099-8ecf4664e1e7",
                    "ea97b94e-0d60-4351-9823-2cfac103eaf8",
                    "2a090665-d567-4133-b713-041ac410a703",
                    "cf2a5cd4-ce40-4eff-8f24-69a07e5114d9",
                    "2dc91db3-8bb8-4d31-8f43-1686294134e7",
                    "56c4b235-e23d-46a8-b2f1-e347ea8c256c",
                    "1ba07550-2827-46ed-93e4-c19f73846428",
                    "6fec8126-d607-4d8a-8fe6-e4cc5589c7d7",
                    "8d403765-1faf-4ee8-b378-c69afe083b9a",
                    "07385ad5-d371-493f-8996-58952153bc9e",
                    "56b9e383-34d1-4d4e-b3fd-62ab37f91324",
                    "b5103cf6-d9ce-4946-8c0c-09756f844024",
                    ""
                ]),
                tattoo: pickRandomFromArray(['cde39d1a-8c29-4df0-9cdb-c34c228312b6', '']),

               
            }
        }};

    const fetchAvatar = async (queryString?: string): Promise<Blob> => {
        const headers = new Headers();

        headers.append("Content-Type", "application/json");
        // please set valid token when starting the app
        headers.append("Authorization", `Bearer ${process.env.REACT_APP_VITE_TOKEN}`);

        const rpmData = await fetch(COMPILE_URL + queryString, {
            method: "POST",
            headers,
            body: JSON.stringify(exampleEditorRequest)                
        });
        
        return rpmData.blob();
    }

    // this state is used to store the avatar blob with different quality while lazy loading
    const [avatarBlob, setAvatarBlob] = useState<Blob>();
    
    const handleRandomizeAvatar = () => {
        let isHighReady = false;

        fetchAvatar(HIGH_QUALITY_QUERY_STING).then((highQualityAvatarBlob) => { 
            isHighReady = true; 

            setAvatarBlob(highQualityAvatarBlob); 
        });
        fetchAvatar(LOW_QUALITY_QUERY_STING).then((lowQualityAvatarBlob) => { 
            
            // do not set low quality avatar if high quality is already loaded
            if(!isHighReady) {
                setAvatarBlob(lowQualityAvatarBlob) 
            }
        });
    };

    return (       
        <div className={styles.app}>
            <div className={styles.settings}>
                <div className={styles.wrapper}>
                    <button className={styles.button} type="button" onClick={handleRandomizeAvatar}>Randomize Avatar</button>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.card}>
                    <Avatar 
                        modelSrc={avatarBlob as any}
                        fov={45}
                        effects={{
                            ambientOcclusion: true
                        }} 
                    >
                        <StatsGl />
                    </ Avatar>
                </div> 
            </div> 
        </div>
    )
}

export default EditorComponent;