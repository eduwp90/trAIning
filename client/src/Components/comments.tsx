import React, { createElement, useState } from "react";
import { Comment, Tooltip, Avatar } from "antd";
import dayjs from "dayjs";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const CommentComp: React.FC = () => {
  const [likes, setLikes] = useState<number>(0);
  const [action, setAction] = useState<string | null>(null);

  const like = () => {
    setLikes(1);
    setAction("liked");
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>
    // <span key="comment-basic-reply-to">Reply to</span>
  ];
  return (
    <div className="profile-card">
      <Comment
        actions={actions}
        style={{ width: 300 }}
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
        content={
          <p>
            We supply a series of design principles, practical patterns and high quality design resources (Sketch and
            Axure), to help people create their product prototypes beautifully and efficiently.
          </p>
        }
        datetime={<Tooltip title={dayjs().format("YYYY-MM-DD HH:mm:ss")}>{<span>{dayjs().fromNow()}</span>}</Tooltip>}
      />
    </div>
  );
};
export default CommentComp;
