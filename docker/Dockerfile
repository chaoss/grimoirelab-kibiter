FROM debian:stable

MAINTAINER David Pose <dpose@bitergia.com>, Alvaro del Castillo <acs@bitergia.com>, David Moreno <dmoreno@bitergia.com>
# Image for developing Kibiter/Kibana

# ENV KIBANA_BRANCH master
ENV KIBANA_BRANCH integration-6.1.4

# add our user and group first to make sure their IDs get assigned consistently
RUN groupadd --system kibana && \
    useradd --system --create-home --gid kibana kibana

# backports used to install java 8 needed by elasticsearch 5
# ruby gems are used for building binary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
            ca-certificates dirmngr gnupg \
            curl \
            wget \
            git \
            python \
            zip \
            make \
            g++ \
            ruby-dev rpm rubygems \
            libffi-dev \
            && \
    # install nvm
    curl -o /tmp/nvm-install.sh -sSL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh && \
    chmod +x /tmp/nvm-install.sh && \
    bash -c /tmp/nvm-install.sh && \
    . /root/.bashrc && \

    # install kibiter
    # gems needed in Kibana > 5.x to build binary packages
    gem install rake && \
    gem install ffi && \
    gem install fpm -v 1.5.0 && \
    gem install pleaserun -v 0.0.24 && \
    git clone --depth 1 --branch ${KIBANA_BRANCH} https://github.com/grimoirelab/kibiter.git && \
    cd kibiter && \
    nvm install "$( cat .node-version )" && \
    npm install -g grunt-cli && \
    npm install && \
    # Build the kibiter package
    sed -e "/return \[/,/\].map/ {/\(windows\|darwin\|x86\)/ d;s/,//g}" -i tasks/config/platforms.js && \
    grunt --no-color _build:downloadNodeBuilds:start _build:downloadNodeBuilds:finish && \
    grunt --no-color build && \
    tar xfz target/kibiter-*-linux-x86_64.tar.gz --directory /opt && \
    mv /opt/kibiter-*-linux-x86_64* /opt/kibana && \
    chown -R kibana:kibana /opt/kibana  && \
    # Install dotplot plugin: https://github.com/dlumbrer/kbn_dotplot
    cd /opt/kibana/plugins && \
    git clone https://github.com/dlumbrer/kbn_dotplot.git -b 6.2-dev && \
    cd kbn_dotplot && \
    npm install  && \
    cd .. && \
    # Install polar plugin: https://github.com/dlumbrer/kbn_polar
    cd /opt/kibana/plugins && \
    git clone https://github.com/dlumbrer/kbn_polar.git -b 6.2-dev && \
    cd kbn_polar && \
    npm install  && \
    cd .. && \
    # Install radar plugin: https://github.com/dlumbrer/kbn_radar
    cd /opt/kibana/plugins && \
    git clone https://github.com/dlumbrer/kbn_radar.git -b 6.2-dev && \
    cd kbn_radar && \
    npm install  && \
    cd .. && \
    # Install kibana-enchanced table plugin: https://github.com/fbaligand/kibana-enhanced-table
    cd /opt/kibana && \
    ./bin/kibana-plugin install https://github.com/fbaligand/kibana-enhanced-table/releases/download/v1.1.0/enhanced-table-1.1.0_6.1.4.zip && \
    cd .. && \
    # Install network plugin: https://dlumbrer.github.io/kbn_network/
    git clone https://github.com/dlumbrer/kbn_network.git network_vis -b 6.2-dev && \
    cd network_vis && \
    npm install  && \
    cd /root && \
    # cleanup to thin the final image
    rm -rf /kibiter && \
    apt-get purge -y g++ git make python zip wget && \
    apt-get autoremove --purge -y && \
    apt-get clean && \
    find /var/lib/apt/lists -type f -delete && \
    rm -rf /root/.npm /root/.node-gyp /root/.nvm /tmp/* /var/tmp/* && \
    bash -c 'find /usr/share/locale -maxdepth 1 -mindepth 1 -type d | grep -v -e "en_US" | xargs rm -rfv' && \
    bash -c 'localedef --list-archive | grep -v -e "en_US" | xargs localedef --delete-from-archive' && \
    rm -rf /usr/share/doc/*

# grab gosu for easy step-down from root
RUN ( gpg --batch --keyserver hkps://hkps.pool.sks-keyservers.net  --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
     || gpg --batch --keyserver pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \ 
     || gpg --batch --keyserver hkp://keys.gnupg.net:80  --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 )
RUN arch="$(dpkg --print-architecture)" \
	&& set -x \
	&& curl -o /usr/local/bin/gosu -sSL "https://github.com/tianon/gosu/releases/download/1.3/gosu-$arch" \
	&& curl -o /usr/local/bin/gosu.asc -sSL "https://github.com/tianon/gosu/releases/download/1.3/gosu-$arch.asc" \
	&& gpg --verify /usr/local/bin/gosu.asc \
	&& rm /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu

ENV PATH /opt/kibana/bin:$PATH

# Remove kibana optimize so it is regenerated when we modify src files in containers
RUN rm -rf /opt/kibana/optimize/*

COPY ./docker-entrypoint.sh /

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["kibana"]
