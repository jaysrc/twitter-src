import React from 'react';
import Linkify from 'react-linkify';
import * as linkify from 'linkifyjs';
import hashtag from 'linkifyjs/plugins/hashtag'; // optional
hashtag(linkify);

class CardComponent extends React.Component {
    render() {
        let data = this.props.data;
        let linkifyOptions =
        {
            formatHref: function (href, type) {
                if (type === 'hashtag') {
                    href = 'https://twitter.com/hashtag/' + href.substring(1);
                }
                return href;
            }
        }

        return (
            <div>
                <div className='card p-4'>
                    <div className="card-panel grey lighten-5 z-depth-3 hoverable thin">
                        <div className=" valign-wrapper">
                            <div className="box">
                                <div className="img">
                                    <img src={data.user.profile_image_url} alt={data.user.name} />
                                </div>
                            </div>
                            <div className="">
                                <Linkify  options={{attributes: linkifyOptions}}><span className="black-text">{data.text}</span></Linkify>
                            </div>

                        </div>
                        <div className="valign-wrapper right-align chip hoverable">
                            {new Date(data.created_at).toLocaleTimeString()}
                        </div>
                        <div className="valign-wrapper right-align chip hoverable">
                            <a href={`https://twitter.com/${data.user.screen_name}`} target="_blank">{`@${data.user.screen_name}`}</a>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default CardComponent;