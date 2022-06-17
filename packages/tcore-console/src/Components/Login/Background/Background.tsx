import { EIcon, Icon } from "../../..";
import * as Style from "./Background.style";

/**
 */
function Background() {
  return (
    <Style.Container>
      <div className="inner">
        <div className="col">
          <div className="row">
            <Style.Small>
              <Icon icon={EIcon.bolt} size="100px" />
            </Style.Small>

            <Style.Small>
              <Icon icon={EIcon.code} size="100px" />
            </Style.Small>
          </div>

          <Style.Device>
            <Icon icon={EIcon["device-union"]} size="350px" />
          </Style.Device>
        </div>

        <Style.Bucket>
          <Icon icon={EIcon.bucket} size="700px" />
        </Style.Bucket>
      </div>

      <div className="gradient" />
    </Style.Container>
  );
}

export default Background;
