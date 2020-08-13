import * as React from "react";

import { AxiosRequestConfig } from "axios";
// import ToasterInstance from '../Toast/ToasterInstance';
// import { axios } from 'api/axios.config';
// import { toApiError } from 'utils/api';
import { Image, Progress, Button } from "semantic-ui-react";
import axios from "axios";

export interface MediaUploadProps {
  id: string;
  slug: string;
  value: string;
  onChange: (field: string, mediaId: string) => void;
}

export interface MediaUploadState {
  progress: number;
  file?: File;
  error?: string;
}

class MediaUpload extends React.Component<MediaUploadProps, MediaUploadState> {
  state: MediaUploadState = { progress: -1 };

  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    let file = e.target.files[0];
    this.setState({ file: file });

    let data = new FormData();
    data.append("file", file);

    let config: AxiosRequestConfig = {
      onUploadProgress: (p: any) => {
        this.setState({ progress: Math.round((p.loaded * 100) / p.total) });
      },
    };

    this.setState({ error: undefined, progress: 0 });

    axios.post("http://localhost:3000/media/image", data, config).then(
      (res) => {
        this.setState({ error: undefined, progress: -1 });
        this.props.onChange(this.props.id, res.data.path);
      },
      (err) => {
        const message = "error";
        // const message = toApiError(err);
        this.setState({ error: message, progress: -1 });
        // ToasterInstance.show({
        //   message,
        //   iconName: 'danger',
        //   intent: 'danger',
        // });
      }
    );
  };

  handleRemoveImage = () => {
    this.props.onChange(this.props.id, "");
  };

  render() {
    return (
      <div>
        <div>
          {this.props.value !== "" && this.state.progress === -1 && (
            <Image path={this.props.value} />
          )}
          <div style={{ maxWidth: 144 }}>
            {this.state.progress > -1 && (
              <Progress percentage={this.state.progress} />
            )}
          </div>
          {this.props.value && (
            <Button
              style={{ marginTop: -40 }}
              className="button button--negative button--small button--secondary"
              role="button"
              onClick={this.handleRemoveImage}
              href="#"
            >
              Remove
            </Button>
          )}
        </div>
        <div style={{ marginTop: 10 }}>
          <label className="button button--purple button--secondary">
            Upload new picture
            <input
              className="visually-hidden"
              type="file"
              onChange={this.handleFileChange}
            />
          </label>
        </div>
      </div>
    );
  }
}
export default MediaUpload;
